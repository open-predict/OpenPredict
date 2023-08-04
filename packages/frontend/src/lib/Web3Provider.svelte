<script lang="ts">
  import {
    TransactionMessage,
    Connection,
    TransactionInstruction,
    VersionedTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction,
    type TransactionError,
    AddressLookupTableAccount,
  } from "@solana/web3.js";
  import { web3Workspace } from "./web3Workspace";
  import { Modal, modalStore } from "$lib/modals/modalStore";
  import base58 from "bs58";
  import {
    PUBLIC_SOLANA_RPC_URL as rpcUrl,
    PUBLIC_USDC_MINT_ADDR,
    PUBLIC_MAIN_PROGRAM_ID,
    PUBLIC_FEE_PAYER_KEY,
  } from "$env/static/public";
  import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
  import * as web3spl from "@solana/spl-token";
  import createMagic, { type TMagic } from "./createMagic";
  import { onMount } from "svelte";
  import { trpcc } from "./trpc";
  import createConnection from "./createConnection";
  import { swapCoinsInstructions, Errors, TxStatus, delay, log } from "./utils";
  import { web3Store } from "./web3Store";

  const usdcMintAddr = new PublicKey(PUBLIC_USDC_MINT_ADDR);
  const mainProgramId = new PublicKey(PUBLIC_MAIN_PROGRAM_ID);
  const connection = createConnection();
  const network: "devnet" | "testnet" | "mainnet-beta" =
    rpcUrl.includes("127.0.0.1") ||
    rpcUrl.includes("localhost") ||
    rpcUrl.includes("devnet")
      ? "devnet"
      : rpcUrl.includes("testnet")
      ? "testnet"
      : "mainnet-beta";

  if (connection) {
    connection.onLogs(
      mainProgramId,
      (logs, _) => {
        console.log("[connection-logs]", logs.logs);
      },
      "finalized"
    );
  }

  $: ({ connected } = $walletStore);
  $: connected, onWalletProviderChange();

  function onWalletProviderChange() {
    if ($walletStore.wallet?.connected && $walletStore.wallet?.publicKey) {
      setPublicKey($walletStore.wallet.publicKey);
      web3Store.updateWalletKind(false);
    }
  }

  function setPublicKey(key: PublicKey) {
    if (key) {
      web3Store.upsertPublicKey(key);
      refreshSolBalance();
      refreshUsdcAddress();
    }
  }

  onMount(async () => {
    let magic: TMagic | null = createMagic(rpcUrl);
    let _publicKey: PublicKey | null | undefined = $web3Store?.publicKey;
    // refresh magic if logged in OR try magic if cookies indicate we're not logged in
    if (magic && (!_publicKey || (_publicKey && $web3Store?.magicWallet))) {
      const loggedIntoMagic = await magic.user.isLoggedIn();
      if (loggedIntoMagic) {
        const magicMetadata = await magic.user.getInfo();
        if (!magicMetadata.publicAddress)
          throw new Error("Logged into magic without a solana address");
        setPublicKey(new PublicKey(magicMetadata.publicAddress));
        web3Store.updateWalletKind(true);
      } else {
        web3Store.updateWalletKind(false);
        if (
          !($walletStore.wallet?.connected && $walletStore.wallet?.publicKey)
        ) {
          web3Store.upsertPublicKey(null);
        }
      }
    } else {
      web3Store.updateWalletKind(false);
      if (!($walletStore.wallet?.connected && $walletStore.wallet?.publicKey)) {
        web3Store.upsertPublicKey(null);
      }
    }
  });

  const requestSol = async () => {
    const publicKey = $web3Store?.publicKey;
    const connection = createConnection();
    if (publicKey && connection) {
      const sig = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sig);
      refreshSolBalance();
    } else {
      alert("No pub key or connection");
    }
  };

  async function refreshUsdcAddress() {
    const publicKey = $web3Store?.publicKey;
    if (publicKey && connection) {
      try {
        const accountPubKey = await web3spl.getAssociatedTokenAddress(
          usdcMintAddr,
          publicKey,
          false
        );
        const account = await web3spl.getAccount(connection, accountPubKey);
        web3Store.updateUsdcAddress(account.address);
        refreshUsdcBalance();
      } catch (err: unknown) {
        if (err instanceof web3spl.TokenAccountNotFoundError) {
          web3Store.updateUsdcAddress(null);
          web3Store.updateUsdcBalance(undefined);
          console.error("No USDC account found");
        } else {
          console.error(err);
        }
      }
    }
  }

  async function makeAuthenticatedRequest(
    request: () => Promise<boolean>
  ): Promise<boolean> {
    try {
      const publicKey = $web3Store?.publicKey;

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
        let signedMessage: any = null;
        if ($walletStore.connected && $walletStore.signMessage) {
          signedMessage = await $walletStore.signMessage(challenge);
        } else {
          const magic = createMagic(rpcUrl);
          if (magic) {
            signedMessage = await magic.solana.signMessage(challenge);
          } else {
            throw new Error("no wallet to sign with");
          }
        }
        const loginResponse = await trpcc.login2.mutate({
          message: [].slice.call(challenge, 0),
          key: publicKey.toBase58(),
          signature: Array.prototype.slice.call(signedMessage, 0),
        });
        modalStore.closeModal(Modal.backend_auth);
        if (loginResponse.error !== null) {
          throw loginResponse.error;
        }
        web3Store.updateOpAuth(true);
      }

      if ($web3Store?.oPauthed) {
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
      console.error(e);
      return false;
    }
  }

  const refreshSolBalance = async () => {
    const publicKey = $web3Store?.publicKey;
    if (publicKey === null) {
      web3Store.updateSolBalance(0);
      web3Store.updateUsdcBalance({
        amount: "0",
        uiAmount: 0,
        uiAmountString: "0",
        decimals: 9,
      });
      return;
    }
    if (publicKey && connection) {
      try {
        const balance = await connection.getBalance(publicKey);
        web3Store.updateSolBalance(balance / LAMPORTS_PER_SOL);
        if (balance === 0) {
          modalStore.openModal(Modal.low_sol);
        } else {
          modalStore.closeModal(Modal.low_sol);
        }
      } catch (err) {
        console.error("error getting sol balance: ", err);
        //TODO: Show error message on UI/retry
      }
    }
  };

  const refreshUsdcBalance = async () => {
    const publicKey = $web3Store?.usdcAddress;
    if (publicKey === null) {
      return;
    }
    if (publicKey && connection) {
      const balance = await connection.getTokenAccountBalance(publicKey);
      web3Store.updateUsdcBalance(balance.value);
    }
  };

  async function loginToMagic(email: string): Promise<boolean> {
    try {
      const magic = createMagic(rpcUrl);
      if (!magic) {
        console.error("Magic.link not supported in this environment");
        return false;
      }
      const res = await magic.auth.loginWithMagicLink({
        email: email,
        showUI: true,
      });
      if (res) {
        const magicMetadata = await magic.user.getInfo();
        if (!magicMetadata.publicAddress)
          throw new Error("Logged into magic with no public key");
        setPublicKey(new PublicKey(magicMetadata.publicAddress));
        web3Store.updateWalletKind(true);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      alert(err);
      console.error(err);
      return false;
    }
  }

  const magicLogout = async () => {
    const magic = createMagic(rpcUrl);
    if (!magic) {
      console.error("Magic.link not supported in this environment");
      return false;
    }
    await magic.user.logout();
  };

  function supportVersionedTransactions() {
    const wallet =
      $walletStore.connected &&
      $walletStore.wallet &&
      $walletStore.signTransaction;
    if (wallet) {
      const supportedVersions =
        $walletStore.wallet?.supportedTransactionVersions;
      return supportedVersions == null || supportedVersions!.has(0);
    }
    return false;
  }

  async function handleOpenPredictTransaction(
    instructions: TransactionInstruction[],
    onStatus?: (status: TxStatus) => void,
    onComplete?: (slot: number, hash: string) => void,
    onError?: (e: Error | Errors) => void
  ) {
    if (!onStatus) onStatus = (s) => console.log("tx status", s);
    if (!onComplete) onComplete = () => console.log("tx complete");
    if (!onError) onError = (e) => alert(e);

    try {
      const publicKey = $web3Store?.publicKey;

      if (!publicKey) {
        onError(Errors.LOGGED_OUT);
        return;
      }

      if (!connection) {
        onError(Errors.NO_CONNECTION);
        return;
      }

      onStatus(TxStatus.SIGNING);

      const {
        id: signTxId,
        signedTx,
        error: signTxError,
      } = await signTransaction(instructions);

      if (signTxError || !signTxId || !signedTx) {
        onError(signTxError ?? new Error("Unable to sign transaction."));
        return;
      }

      onStatus(TxStatus.SENDING);

      const { error, tx_id } = await trpcc.sendOpenPredictTransaction.query({
        transaction: base58.encode(signedTx.serialize()),
      });

      if (error || !tx_id) {
        onError(new Error("Unable to send transaction: " + error!));
        return;
      }

      onStatus(TxStatus.COMPLETE);
      onComplete(1, tx_id);
    } catch (e: any) {
      console.error(e);
      if (e instanceof Error) {
        onError(e);
      } else {
        onError(new Error(e));
      }
    }
  }

  const signTransaction = async (
    instructions: TransactionInstruction[],
    addressLookupTables?: AddressLookupTableAccount[]
  ): Promise<{
    id?: string;
    error?: Errors | Error;
    signedTx?: VersionedTransaction | Transaction;
  }> => {
    try {
      const payerKey = new PublicKey(PUBLIC_FEE_PAYER_KEY);
      const publicKey = $web3Store?.publicKey;

      if (!publicKey) return { error: Errors.LOGGED_OUT };
      if (!connection) return { error: Errors.NO_CONNECTION };

      if (
        $walletStore.connected &&
        $walletStore.wallet &&
        $walletStore.signTransaction
      ) {
        let transaction: VersionedTransaction | Transaction;
        const supportedVersions =
          $walletStore.wallet.supportedTransactionVersions;
        const transactionMessage = new TransactionMessage({
          payerKey: payerKey,
          recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
          instructions,
        });

        log("web3", "prompting wallet to sign a transaction");

        if (supportedVersions == null || supportedVersions!.has(0)) {
          // brave: !supportedVersions, TODO: check others
          log("web3", "compiling to v0 message");

          transaction = new VersionedTransaction(
            transactionMessage.compileToV0Message(addressLookupTables)
          );

          const signedTx = await $walletStore.signTransaction(transaction);

          log("web3", "signed tx");

          const txId = signedTx.signatures[0];

          return {
            signedTx,
            id: base58.encode(txId),
          };
        } else if (supportedVersions!.has("legacy")) {
          log("web3", "compiling to legacy message");

          transaction = new VersionedTransaction(
            transactionMessage.compileToLegacyMessage()
          );

          const signedTx = await $walletStore.signTransaction(transaction);

          const txId = signedTx.signatures[0];

          return {
            signedTx,
            id: base58.encode(txId),
          };
        } else {
          return {
            error: Errors.NO_WALLET,
          };
        }
      } else {
        const magic = createMagic(rpcUrl);
        if (!magic) {
          return {
            error: Errors.NO_WALLET,
          };
        }
        const serializeConfig = {
          requireAllSignatures: false,
          verifySignatures: true,
        };

        log("web3", "prompting magic wallet to sign a transaction");

        const magicSignedTx = await magic.solana.signTransaction(
          {
            instructions,
            feePayer: payerKey,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
          },
          serializeConfig
        );

        const signedTx = Transaction.from(magicSignedTx.rawTransaction);
        const signature =
          signedTx.signatures && signedTx.signatures[0].signature
            ? base58.encode(signedTx.signatures[0].signature)
            : "";

        log("web3", "signed transaction with signature", signature);

        return {
          signedTx,
          id: signature,
        };
      }
    } catch (e: any) {
      console.error(e);
      if (e instanceof Error) {
        return {
          error: e,
        };
      }
      return {
        error: new Error(e),
      };
    }
  };

  const sendTransaction = async (
    txId: string,
    signedTx: VersionedTransaction | Transaction
  ): Promise<{ id?: string; error?: Errors | Error }> => {
    try {
      if (!connection) return { error: Errors.NO_CONNECTION };
      let id = txId;
      log("web3", "sending transaction to connection...", id);
      id = await connection.sendRawTransaction(signedTx.serialize());
      log("web3", "sent transaction to connection", id);
      return { id };
    } catch (e: any) {
      console.error(e);
      if (e instanceof Error) {
        return {
          error: e,
        };
      }
      return {
        error: new Error(e),
      };
    }
  };

  const confirmTransaction = async (
    id: string
  ): Promise<{
    slot?: number;
    txError?: TransactionError;
    error?: Errors | Error;
  }> => {
    // TODO: Add timeout
    if (!connection) return { error: Errors.NO_CONNECTION };
    try {
      let latestBlockhash = await connection.getLatestBlockhash();
      const confirmation = await connection.confirmTransaction({
        signature: id,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        blockhash: latestBlockhash.blockhash,
      });
      refreshSolBalance();
      refreshUsdcAddress();
      if (confirmation.value.err) console.error(confirmation.value.err);
      return {
        txError: confirmation.value.err ?? undefined,
        slot: confirmation.context.slot,
      };
    } catch (e: any) {
      console.error(e);
      if (e instanceof Error) {
        return {
          error: e,
        };
      }
      return {
        error: new Error(e),
      };
    }
  };

  const logout = async () => {
    web3Store.upsertPublicKey(null);
    web3Store.updateUsdcAddress(null);
    web3Store.updateSolBalance(0);
    web3Store.updateUsdcBalance(undefined);
    web3Store.updateWalletKind(false);
    if ($web3Store?.magicWallet) {
      const magic = createMagic(rpcUrl);
      if (magic) {
        await magicLogout();
      }
    } else {
      await $walletStore.disconnect();
    }
  };

  web3Workspace.update((v) => ({
    ...v,
    requestSol,
    loginToMagic,
    logout: logout,
    makeAuthenticatedRequest,
    refreshBalances: async () => {
      await refreshSolBalance();
      await refreshUsdcBalance();
    },
    refreshKeys: refreshUsdcAddress,
    signTransaction,
    sendTransaction,
    confirmTransaction,
    handleTransaction: handleOpenPredictTransaction,
  }));
</script>
