<script lang="ts">
  import {
    TransactionInstruction,
    PublicKey,
    Transaction,
  } from "@solana/web3.js";
  import { web3Workspace } from "./web3Workspace";
  import { Modal, modalStore } from "$lib/modals/modalStore";
  import base58 from "bs58";
  import { PUBLIC_MAIN_PROGRAM_ID } from "$env/static/public";
  import { onMount } from "svelte";
  import { trpcc } from "./trpc";
  import createConnection from "./createConnection";
  import { Errors, TxStatus, delay } from "./utils";
  import log from "$lib/log";
  import { web3Store, type TAddressKey } from "./web3Store";
  import { Network, Web3 } from "./network";

  const FILE = "Web3Provider";

  let web3Evm: Web3;
  let web3Sol: Web3;

  const mainProgramId = new PublicKey(PUBLIC_MAIN_PROGRAM_ID);
  const connection = createConnection();

  if (connection) {
    connection.onLogs(
      mainProgramId,
      (logs, _) => {
        log("info", "connection-logs", logs.logs);
      },
      "finalized"
    );
  }

  onMount(async () => {
    log("debug", FILE, "onMount");
    web3Evm = await Web3.create(Network.Polygon);
    web3Sol = await Web3.create(Network.Solana);
    if (await web3Evm.loggedIn()) {
      refreshAddress("polygonAddress");
      refreshAddress("solanaAddress");
      refreshAddress("solanaAddress");
      refreshAddress("solanaUsdcAddress");
      refreshBalance("polygonAddress");
      refreshBalance("polygonUsdcAddress");
      refreshBalance("solanaAddress");
      refreshBalance("solanaUsdcAddress");
    } else {
      web3Store.upsertAddress({
        polygonAddress: null,
        polygonUsdcAddress: null,
        solanaAddress: null,
        solanaUsdcAddress: null,
      });
      web3Store.upsertBalance({
        polygonAddress: 0n,
        polygonUsdcAddress: 0n,
        solanaAddress: 0n,
        solanaUsdcAddress: 0n,
      });
    }
  });

  async function refreshBalance(address: TAddressKey) {
    let n: Partial<Record<TAddressKey, bigint>> = {};
    if (!web3Evm || !web3Sol) {
      console.error(
        "Cannot refresh balance",
        address,
        "web3 not initialized..."
      );
      return;
    }
    if (address === "polygonAddress" || address === "polygonUsdcAddress") {
      const balance = await web3Evm.getBalance();
      if (balance) {
        n[address] = balance ?? 0n;
      }
    } else {
      const balance = await web3Sol.getBalance();
      if (balance) {
        n[address] = balance ?? 0n;
      }
    }
    web3Store.upsertBalance(n);
  }

  async function refreshAddress(address: TAddressKey) {
    let n: Partial<Record<TAddressKey, string | null>> = {};
    if (!web3Evm || !web3Sol) {
      console.error(
        "Cannot refresh balance",
        address,
        "web3 not initialized..."
      );
      return;
    }
    if (address === "polygonAddress" || address === "polygonUsdcAddress") {
      const addr = await web3Evm.getAddress();
      n[address] = addr ?? null;
    } else if (address === "solanaAddress") {
      const addr = await web3Sol.getAddress();
      n[address] = addr ?? null;
    } else {
      const addr = await web3Sol.getUsdcAddress();
      n[address] = addr ?? null;
    }
    web3Store.upsertAddress(n);
  }

  async function makeAuthenticatedRequest(
    request: () => Promise<boolean>
  ): Promise<boolean> {
    try {
      const address = $web3Store?.solanaAddress;
      const publicKey = address ? new PublicKey(address) : null;

      if (!publicKey) {
        modalStore.openModal(Modal.login);
        return false;
      }

      async function signProcess(publicKey: PublicKey) {
        modalStore.openModal(Modal.backend_auth);
        const challengeRes = await trpcc.getLoginChallenge.mutate({});
        if (!challengeRes) throw new Error("no challenge in response");
        await delay(1000);
        const challenge = Buffer.from(challengeRes.challenge, "hex");
        let signedMessage = await web3Sol.signMessage(challenge);
        const loginResponse = await trpcc.login2.mutate({
          message: [].slice.call(challenge, 0),
          key: publicKey.toBase58(),
          signature: Array.prototype.slice.call(signedMessage, 0),
        });
        modalStore.closeModal(Modal.backend_auth);
        if (loginResponse.error !== null) {
          throw loginResponse.error;
        }
        web3Store.updateAuthedWithBackend(true);
      }

      if ($web3Store?.authedWithBackend) {
        const done = await request();
        if (done) return true;
        await signProcess(publicKey);
        return await request();
      } else {
        await signProcess(publicKey);
        return await request();
      }
    } catch (e) {
      modalStore.closeModal(Modal.backend_auth);
      log("error", FILE, e);
      return false;
    }
  }

  async function login(email: string): Promise<boolean> {
    if (!web3Evm) {
      log("error", FILE, "Can't login, web3auth not initialized.");
      return false;
    }
    try {
      await web3Evm.login(email);
      if (!(await web3Evm.loggedIn())) {
        return false;
      }
      refreshAddress("polygonAddress");
      refreshAddress("solanaAddress");
      refreshAddress("solanaAddress");
      refreshAddress("solanaUsdcAddress");
      refreshBalance("polygonAddress");
      refreshBalance("polygonUsdcAddress");
      refreshBalance("solanaAddress");
      refreshBalance("solanaUsdcAddress");
      return true;
    } catch (err) {
      alert(err);
      log("error", FILE, err);
      return false;
    }
  }

  const logout = async () => {
    if (!web3Evm || !web3Sol) {
      log("error", FILE, "Can't login, web3auth not initialized.");
      return;
    }
    await web3Evm.logout();
    await web3Sol.logout();
    web3Store.upsertAddress({
      polygonAddress: null,
      polygonUsdcAddress: null,
      solanaAddress: null,
      solanaUsdcAddress: null,
    });
    web3Store.upsertBalance({
      polygonAddress: 0n,
      polygonUsdcAddress: 0n,
      solanaAddress: 0n,
      solanaUsdcAddress: 0n,
    });
  };

  async function handleOpenPredictTransaction(
    instructions: TransactionInstruction[],
    onStatus?: (status: TxStatus) => void,
    onComplete?: (slot: number, hash: string) => void,
    onError?: (e: Error | Errors) => void
  ) {
    if (!onStatus) onStatus = (s) => log("info", FILE, "tx status", s);
    if (!onComplete) onComplete = () => log("info", FILE, "tx complete");
    if (!onError) onError = (e) => alert(e);

    try {
      const address = $web3Store?.solanaAddress;
      const publicKey = address ? new PublicKey(address) : null;

      if (!publicKey) {
        onError(Errors.LOGGED_OUT);
        return;
      }

      onStatus(TxStatus.SIGNING);

      const signedTx = (await web3Sol.signTransaction(
        instructions
      )) as Transaction;

      // if (signTxError || !signedTx) {
      //   onError(signTxError ?? new Error("Unable to sign transaction."));
      //   return;
      // }

      onStatus(TxStatus.SENDING);

      const { error, tx_id } = await trpcc.sendOpenPredictTransaction.query({
        transaction: base58.encode(
          signedTx.serialize({
            requireAllSignatures: false,
          })
        ),
      });

      if (error || !tx_id) {
        onError(new Error("Unable to send transaction: " + error!));
        return;
      }

      onStatus(TxStatus.COMPLETE);
      onComplete(1, tx_id);
    } catch (e: any) {
      log("error", FILE, e);
      if (e instanceof Error) {
        onError(e);
      } else {
        onError(new Error(e));
      }
    }
  }

  web3Workspace.update((v) => ({
    ...v,
    login,
    logout: logout,
    makeAuthenticatedRequest,
    refreshBalances: async () => {
      await refreshBalance("polygonAddress");
      await refreshBalance("polygonUsdcAddress");
      await refreshBalance("solanaAddress");
      await refreshBalance("solanaUsdcAddress");
    },
    refreshKeys: async () => {
      await refreshAddress("polygonAddress");
      await refreshAddress("solanaAddress");
      await refreshAddress("solanaAddress");
      await refreshAddress("solanaUsdcAddress");
    },
    handleTransaction: handleOpenPredictTransaction,
  }));
</script>
