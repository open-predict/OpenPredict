import {ChainCache} from "./amclient/globals";
import * as web3 from "@solana/web3.js"
import * as NodeCache from "node-cache"

interface Global {
	chainCache: ChainCache
	mainProgramId: web3.PublicKey,
	usdcMintAddr: web3.PublicKey,
	loginChallengeCache: NodeCache,
}
