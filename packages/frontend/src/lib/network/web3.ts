import { Web3AuthNoModal } from "@web3auth/no-modal"
import { Network } from "./networks"
import { WALLET_ADAPTERS, type IProvider } from "@web3auth/base";
import { PUBLIC_POLYGON_RPC_URL, PUBLIC_SOLANA_RPC_URL, PUBLIC_WEB3AUTH_ID } from "$env/static/public";
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import createOpenloginAdapter from "./openLoginAdapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import type { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import type { Transaction, TransactionInstruction } from "@solana/web3.js";
import type { JsonRpcSigner, TransactionRequest } from "ethers6"
import type { TBalance } from "$lib/web3Store";

export abstract class Web3 {

  public abstract network: Network
  public web3Auth: Web3AuthNoModal | null = null;
  public provider: IProvider | null = null;
  public torus: SolanaWalletConnectorPlugin | TorusWalletConnectorPlugin | null = null;

  protected async initialize(): Promise<void> {

    let web3Auth: Web3AuthNoModal;
    let openloginAdapter: OpenloginAdapter;
    let provider: IProvider | null;
    let chainConfig;
    let torus;

    const torusConfig = {
      torusWalletOpts: {},
      walletInitOptions: {
        showTorusButton: false,
        whiteLabel: {
          theme: { isDark: true, colors: { primary: "#00a8ff" } },
          logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        },
      },
    }

    switch (this.network) {
      case Network.Solana:

        chainConfig = {
          chainId: "0x1",
          rpcTarget: PUBLIC_SOLANA_RPC_URL,
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
        }

        web3Auth = new Web3AuthNoModal({
          clientId: PUBLIC_WEB3AUTH_ID,
          web3AuthNetwork: "sapphire_mainnet",
          chainConfig: {
            chainNamespace: "solana",
            ...chainConfig
          }
        })

        openloginAdapter = createOpenloginAdapter(
          new SolanaPrivateKeyProvider({
            config: {
              chainConfig
            }
          })
        )

        web3Auth.configureAdapter(openloginAdapter);

        await web3Auth.init();
        provider = web3Auth.provider;

        torus = new SolanaWalletConnectorPlugin(torusConfig);
        await web3Auth.addPlugin(torus);

        if (web3Auth.connected) {
          await torus.initWithWeb3Auth(web3Auth);
          await torus.connect();
          await torus.torusWalletInstance.hideTorusButton();
        }
        break

      default:

        chainConfig = {
          chainId: "0x89", // hex of 80001, polygon testnet
          rpcTarget: PUBLIC_POLYGON_RPC_URL,
          displayName: "Polygon",
          blockExplorer: "https://polygonscan.com/",
          ticker: "MATIC",
          tickerName: "Matic",
        }

        web3Auth = new Web3AuthNoModal({
          clientId: PUBLIC_WEB3AUTH_ID,
          web3AuthNetwork: "sapphire_mainnet",
          chainConfig: {
            chainNamespace: "eip155",
            ...chainConfig
          },
        });

        openloginAdapter = createOpenloginAdapter(
          new EthereumPrivateKeyProvider({
            config: {
              chainConfig
            }
          })
        )

        web3Auth.configureAdapter(openloginAdapter);

        await web3Auth.init();
        provider = web3Auth.provider;

        torus = new TorusWalletConnectorPlugin(torusConfig);
        await web3Auth.addPlugin(torus);

        if (web3Auth.connected) {
          await torus.initWithWeb3Auth(web3Auth);
          await torus.connect();
          await torus.torusWalletInstance.hideTorusButton();
        }
    }

    this.web3Auth = web3Auth;
    this.provider = provider;
    this.torus = torus;
  }

  public static async create(network: Network): Promise<Web3> {
    let web3;
    switch (network) {
      case Network.Solana: {
        const { SOL } = await import("./SOL")
        web3 = new SOL()
        await web3.initialize()
        web3.initRPC()
        return web3
      }
      default: {
        const { EVM } = await import("./EVM")
        web3 = new EVM(network)
        await web3.initialize()
        web3.initRPC()
        return web3
      }
    }
  }

  public async login(email: string): Promise<void> {
    if (!this.web3Auth) {
      console.error("web3auth not initialized...");
      return;
    }
    await this.web3Auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          login_hint: email,
        },
      }
    );
    if (this.web3Auth.connected && this.torus) {
      await this.torus.initWithWeb3Auth(this.web3Auth);
      await this.torus.connect();
      await this.torus.torusWalletInstance.hideTorusButton();
    } else {
      throw new Error("Couldn't login, cannot connect torus...")
    }
  }

  public async logout() {
    if (!this.web3Auth) {
      console.error("web3auth not initialized");
      return;
    }
    await this.web3Auth?.logout()
  }

  public async loggedIn() {
    if(!this.web3Auth){
      console.error("Not logged in, no web3Auth instance...")
      return false;
    }
    return await this.web3Auth.connected
  }

  public async topup(cents: number) {
    const address = await this.getAddress();
    if (!address) {
      console.error("No address")
      return;
    }
    if (!this.torus) {
      console.error("Torus not initialized")
      return;
    }
    await this.torus.initiateTopup("moonpay", {
      selectedAddress: address,
      selectedCurrency: "USD",
      fiatValue: cents,
      selectedCryptoCurrency: this.network === Network.Solana ? "usdc_sol" : "usdc_polygon"
    });
  }

  public abstract initRPC(): void

  public abstract getBalance(): Promise<TBalance | undefined>

  public abstract getUsdcBalance(): Promise<TBalance | undefined>

  public abstract getAddress(): Promise<string | undefined>

  public abstract getUsdcAddress(): Promise<string | undefined>

  public abstract signMessage(data: Uint8Array): Promise<Uint8Array | undefined>

  public abstract signTransaction(tx: TransactionInstruction[] | TransactionRequest): Promise<string | Transaction | undefined>

  public abstract sendTransaction(tx: string | Transaction): Promise<boolean>

  public abstract confirmTransaction(tx: string): Promise<boolean>

  public abstract getWallet(): Promise<SolanaWallet | JsonRpcSigner | null>

}
