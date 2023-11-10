<script lang="ts">
  import {
    TransactionInstruction,
    PublicKey,
    Transaction,
  } from "@solana/web3.js";
  import { TxStatus, web3Workspace } from "./web3Workspace";
  import { Modal, modalStore } from "$lib/modals/modalStore";
  import base58 from "bs58";
  import {
    PUBLIC_OP_MAIN_PROGRAM_ADDR,
    PUBLIC_PM_PROXY_WALLET_FACTORY,
    PUBLIC_POLYGON_RPC_URL,
    PUBLIC_PM_CLOB_URL,
  } from "$env/static/public";
  import { onMount } from "svelte";
  import createConnection from "./createConnection";
  import log from "$lib/log";
  import {
    web3Store,
    type TBalance,
    type TAccountKey,
    type TCurrency,
  } from "./web3Store";
  import { EVM, Network, SOL, Web3 } from "./network";
  import { ClobClient, type ApiKeyCreds } from "$lib/clob";
  import { ethers as ethers5 } from "ethers5";
  import { Errors } from "./errors";
  import { getProxyWalletAddress } from "@polymarket/sdk";
  import { api } from "./api";

  const FILE = "Web3Provider";

  let web3Evm: EVM;
  let web3Sol: SOL;
  let polyClob: ClobClient;

  const mainProgramId = new PublicKey(PUBLIC_OP_MAIN_PROGRAM_ADDR);
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

  async function initialize() {
    await Promise.all([
      await refreshAddress("polygon"),
      await refreshAddress("polymarket"),
      await refreshAddress("solana"),
      await refreshAddress("solanaUsdc"),
    ]);
    await Promise.all([
      await refreshBalance("polygon"),
      await refreshBalance("polymarket"),
      await refreshBalance("solana"),
      await refreshBalance("solanaUsdc"),
    ]);
  }

  onMount(async () => {
    log("debug", FILE, "onMount");
    web3Evm = (await Web3.create(Network.Polygon)) as EVM;
    web3Sol = (await Web3.create(Network.Solana)) as SOL;
    if (await web3Evm.loggedIn()) {
      initialize();
    } else {
      web3Store.clear();
    }
    web3Workspace.update((v) => ({
      ...v,
      web3Sol,
      web3Evm,
    }));
  });

  async function createClob() {
    if (!web3Evm || !web3Evm.provider) {
      console.log("Cannot create clob, !web3Evm");
      return;
    }

    const privateKey = await web3Evm.provider?.request({
      method: "eth_private_key",
    });

    const provider = new ethers5.providers.JsonRpcProvider(
      PUBLIC_POLYGON_RPC_URL
    );

    const ethers5Walllet = new ethers5.Wallet(
      privateKey as ethers5.utils.BytesLike,
      provider
    );

    async function getClobClient(keys?: ApiKeyCreds) {
      return new ClobClient(
        PUBLIC_PM_CLOB_URL,
        await ethers5Walllet.getChainId(),
        ethers5Walllet,
        keys
      );
    }

    let keys: ApiKeyCreds | undefined = $web3Store?.polyClobApiKeys;

    if (!keys) {
      const pc = await getClobClient();
      keys = await pc.createOrDeriveApiKey();
    }

    polyClob = await getClobClient(keys);

    web3Store.updatePolyClobApiKeys(keys);
    web3Workspace.update((v) => ({
      ...v,
      polyClob,
    }));
  }

  async function refreshBalance(account: TAccountKey) {
    let n: Partial<Record<TAccountKey, Partial<Record<TCurrency, TBalance>>>> =
      {};
    if (!web3Evm || !web3Sol) {
      console.error(
        "Cannot refresh balance",
        account,
        "web3 not initialized..."
      );
      return;
    }
    switch (account) {
      case "polygon":
        n[account] = {
          MATIC: await web3Evm.getBalance(),
          USDC: await web3Evm.getUsdcBalance(),
        };
        break;
      case "polymarket":
        const address = await web3Evm.getAddress();
        if (address) {
          n[account] = {
            USDC: await web3Evm.getUsdcBalance(
              getProxyWalletAddress(PUBLIC_PM_PROXY_WALLET_FACTORY, address)
            ),
          };
        }
        break;
      case "solana":
        n[account] = {
          SOL: await web3Sol.getBalance(),
        };
        break;
      case "solanaUsdc":
        n[account] = {
          USDC: await web3Sol.getUsdcBalance(),
        };
        break;
      default:
        break;
    }
    web3Store.upsertBalance(n);
  }

  async function refreshAddress(kind: TAccountKey) {
    let n: Partial<Record<TAccountKey, string | null>> = {};
    if (!web3Evm || !web3Sol) {
      console.error("Cannot refresh balance", kind, "web3 not initialized...");
      return;
    }
    let address;
    switch (kind) {
      case "polygon":
        address = await web3Evm.getAddress();
        break;
      case "polymarket":
        const polygonAddress = await web3Evm.getAddress();
        if (polygonAddress) {
          address = await getProxyWalletAddress(
            PUBLIC_PM_PROXY_WALLET_FACTORY,
            polygonAddress
          );
        }
        break;
      case "solana":
        address = await web3Sol.getAddress();
        break;
      case "solanaUsdc":
        address = await web3Sol.getUsdcAddress();
        break;
      default:
        break;
    }
    n[kind] = address;
    web3Store.upsertAddress(n);
  }

  async function makeAuthenticatedRequest(
    request: () => Promise<boolean>
  ): Promise<boolean> {
    try {
      const address = $web3Store?.solana?.address;
      const publicKey = address ? new PublicKey(address) : null;

      if (!publicKey) {
        modalStore.openModal(Modal.login);
        return false;
      }
      // async function signProcess(publicKey: PublicKey) {
      //   modalStore.openModal(Modal.backend_auth);
      //   const challengeRes = await trpcc.getLoginChallenge.mutate({});
      //   if (!challengeRes) throw new Error("no challenge in response");
      //   await delay(1000);
      //   const challenge = Buffer.from(challengeRes.challenge, "hex");
      //   let signedMessage = await web3Sol.signMessage(challenge);
      //   const loginResponse = await trpcc.login2.mutate({
      //     message: [].slice.call(challenge, 0),
      //     key: publicKey.toBase58(),
      //     signature: Array.prototype.slice.call(signedMessage, 0),
      //   });
      //   modalStore.closeModal(Modal.backend_auth);
      //   if (loginResponse.error !== null) {
      //     throw loginResponse.error;
      //   }
      //   web3Store.updateAuthedWithBackend(true);
      // }

      // if ($web3Store?.authedWithBackend) {
      //   const done = await request();
      //   if (done) return true;
      //   await signProcess(publicKey);
      //   return await request();
      // } else {
      //   await signProcess(publicKey);
      //   return await request();
      // }
      return true;
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
      await initialize();
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
    web3Store.clear();
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
      const address = $web3Store?.solana?.address;
      const publicKey = address ? new PublicKey(address) : null;

      if (!publicKey) {
        onError(Errors.LOGGED_OUT);
        return;
      }

      onStatus(TxStatus.SIGNING);

      const { signedTx, signTxError } = await web3Sol
        .signTransaction(instructions)
        .then((t) => ({
          signedTx: t,
          signTxError: null,
        }))
        .catch((e) => ({
          signTxError: e,
          signedTx: null,
        }));

      if (signTxError || !signedTx) {
        onError(signTxError ?? new Error("Unable to sign transaction."));
        return;
      }

      onStatus(TxStatus.SENDING);

      const { error, tx_id } = await api.sendOpenPredictTransaction.query({
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
      await refreshBalance("polygon");
      await refreshBalance("polymarket");
      await refreshBalance("solana");
      await refreshBalance("solanaUsdc");
    },
    refreshKeys: async () => {
      await refreshAddress("polygon");
      await refreshAddress("polymarket");
      await refreshAddress("solana");
      await refreshAddress("solanaUsdc");
    },
    handleTransaction: handleOpenPredictTransaction,
  }));
</script>
