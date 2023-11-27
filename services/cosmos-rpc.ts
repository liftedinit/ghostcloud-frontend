// This file contains the CosmosRPC service.

import type {IProvider} from "@web3auth/base";
import {StargateClient} from "@cosmjs/stargate";
import {DirectSecp256k1Wallet} from "@cosmjs/proto-signing";

export default class CosmosRPC {
  private readonly rpcTarget: string;     // The RPC target URL

  constructor(rpcTarget: string) {
    this.rpcTarget = rpcTarget;
  }

  async getChainId(): Promise<string> {
    try {
      const client = await StargateClient.connect(this.rpcTarget);

      // Get the connected Chain's ID
      const chainId = await client.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }
}