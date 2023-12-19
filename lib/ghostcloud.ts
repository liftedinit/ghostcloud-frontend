import {
  cosmos,
  cosmosAminoConverters,
  cosmosProtoRegistry,
  getSigningCosmosClient,
  ghostcloud,
  ghostcloudAminoConverters,
  ghostcloudProtoRegistry,
} from "@liftedinit/gcjs"
import {
  GHOSTCLOUD_ADDRESS_PREFIX,
  GHOSTCLOUD_DENOM,
  GHOSTCLOUD_GAS_LIMIT_MULTIPLIER,
  GHOSTCLOUD_GAS_PRICE,
  GHOSTCLOUD_RPC_TARGET,
} from "../config/ghostcloud-chain"
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
  GeneratedType,
  OfflineDirectSigner,
  Registry,
} from "@cosmjs/proto-signing"
import { DeploymentData } from "../components/create-deployment"
import {
  AminoTypes,
  calculateFee,
  SigningStargateClient,
} from "@cosmjs/stargate"
import { hexToBytes } from "@metamask/utils"
import { GetTxsEventRequest } from "cosmjs-types/cosmos/tx/v1beta1/service"
import {
  createCreateDeploymentMsg,
  createRemoveDeploymentMsg,
  createSendMsg,
  createUpdateDeploymentMsg,
} from "./message_composer"

async function createSigner(pk: Uint8Array) {
  const getSignerFromKey = async (): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1Wallet.fromKey(pk, GHOSTCLOUD_ADDRESS_PREFIX)
  }
  return await getSignerFromKey()
}
async function createStargateSigningClient(pk: Uint8Array) {
  const signer = await createSigner(pk)
  const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
    ...cosmosProtoRegistry,
    ...ghostcloudProtoRegistry,
  ]

  const aminoConverters = {
    ...cosmosAminoConverters,
    ...ghostcloudAminoConverters,
  }

  const registry = new Registry(protoRegistry)
  const aminoTypes = new AminoTypes(aminoConverters)
  return await SigningStargateClient.connectWithSigner(
    GHOSTCLOUD_RPC_TARGET,
    signer,
    {
      registry: registry,
      aminoTypes: aminoTypes,
      gasPrice: GHOSTCLOUD_GAS_PRICE,
    },
  )
}

// Create a client for sending transactions to Ghostcloud RPC endpoint
// The transaction signer is the given private key
async function createGhostcloudRpcClient(pk: Uint8Array) {
  return await createStargateSigningClient(pk)
}

export const createDeployment = async (
  data: DeploymentData,
  creator: string,
  pk: string,
) => {
  const client = await createGhostcloudRpcClient(hexToBytes(pk))
  const msg = await createCreateDeploymentMsg(data, creator)
  const gasEstimation = await client.simulate(creator, [msg], "")
  const fee = calculateFee(
    Math.round(gasEstimation * GHOSTCLOUD_GAS_LIMIT_MULTIPLIER),
    GHOSTCLOUD_GAS_PRICE,
  )
  const response = await client.signAndBroadcast(creator, [msg], fee, data.memo)
  if (response.code) {
    throw new Error(
      `Deployment creation failed with error code: ${response.code}. Raw log: ${response.rawLog}`,
    )
  }

  return response
}

export const updateDeployment = async (
  data: DeploymentData,
  creator: string,
  pk: string,
) => {
  const client = await createGhostcloudRpcClient(hexToBytes(pk))
  const msg = await createUpdateDeploymentMsg(data, creator)
  const gasEstimation = await client.simulate(creator, [msg], "")
  const fee = calculateFee(
    Math.round(gasEstimation * GHOSTCLOUD_GAS_LIMIT_MULTIPLIER),
    GHOSTCLOUD_GAS_PRICE,
  )
  const response = await client.signAndBroadcast(creator, [msg], fee, data.memo)

  if (response.code) {
    throw new Error(
      `Deployment update failed with error code: ${response.code}. Raw log: ${response.rawLog}`,
    )
  }

  return response
}
export const removeDeployment = async (
  name: string,
  creator: string,
  pk: string,
) => {
  const client = await createGhostcloudRpcClient(hexToBytes(pk))
  const msg = createRemoveDeploymentMsg(name, creator)
  const gasEstimation = await client.simulate(creator, [msg], "")
  const fee = calculateFee(
    Math.round(gasEstimation * GHOSTCLOUD_GAS_LIMIT_MULTIPLIER),
    GHOSTCLOUD_GAS_PRICE,
  )
  const response = await client.signAndBroadcast(creator, [msg], fee)

  if (response.code) {
    throw new Error(
      `Deployment update failed with error code: ${response.code}. Raw log: ${response.rawLog}`,
    )
  }

  return response
}

export const listDeployments = async (address: string) => {
  const { createRPCQueryClient } = ghostcloud.ClientFactory
  const client = await createRPCQueryClient({
    rpcEndpoint: GHOSTCLOUD_RPC_TARGET,
  })

  const filter = ghostcloud.ghostcloud.Filter.fromPartial({
    field: ghostcloud.ghostcloud.Filter_Field.CREATOR,
    operator: ghostcloud.ghostcloud.Filter_Operator.EQUAL,
    value: address,
  })
  const request = ghostcloud.ghostcloud.QueryMetasRequest.fromPartial({
    filters: [filter],
  })
  return await client.ghostcloud.ghostcloud.metas(request)
}

export const fetchBalance = async (address: string) => {
  const { createRPCQueryClient } = cosmos.ClientFactory
  const client = await createRPCQueryClient({
    rpcEndpoint: GHOSTCLOUD_RPC_TARGET,
  })

  // Replace this with the actual method to fetch the balance
  const request = cosmos.bank.v1beta1.QueryBalanceRequest.fromPartial({
    address: address,
    denom: GHOSTCLOUD_DENOM,
  })
  const response = await client.cosmos.bank.v1beta1.balance(request)

  if (response.balance) {
    return response.balance
  } else {
    throw new Error("Failed to fetch balance")
  }
}

export async function fetchTransferEvents(sender: string, recipient: string) {
  const { createRPCQueryClient } = cosmos.ClientFactory
  const client = await createRPCQueryClient({
    rpcEndpoint: GHOSTCLOUD_RPC_TARGET,
  })

  // WARNING: At some point, it will get too slow to search the entire blockchain for transactions
  // TODO: I don't know why but I can't mix `events type` in the same query.
  //       E.g.,
  //         ["transfer.sender='gc1664mxf4257456y3aqfvu75tgqh7kzv9ygzwwuf'", `transfer.recipient='${address}'`] // WORKS
  //         ["message.sender='gc1664mxf4257456y3aqfvu75tgqh7kzv9ygzwwuf'", `transfer.recipient='${address}'`]  // DOESN'T WORKS
  //         ["message.sender='gc1664mxf4257456y3aqfvu75tgqh7kzv9ygzwwuf'", "message.action='/cosmos.bank.v1beta1.MsgSend'"]  // WORKS
  const query = GetTxsEventRequest.fromPartial({
    events: [
      `transfer.sender='${sender}'`,
      `transfer.recipient='${recipient}'`,
    ],
  })
  const response = await client.cosmos.tx.v1beta1.getTxsEvent(query)
  return response.txs
}

// TODO: Refactor this function to not use mnemonic
export async function sendTokens(
  to: string,
  mnemonic: string,
  amount: number,
  invoiceId: string,
  paymentId: string,
  purchaseId: string,
) {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: GHOSTCLOUD_ADDRESS_PREFIX,
  })
  const signerAddress = (await signer.getAccounts())[0].address
  const client = await getSigningCosmosClient({
    rpcEndpoint: GHOSTCLOUD_RPC_TARGET,
    signer: signer,
  })
  const msg = createSendMsg(signerAddress, to, amount.toString())
  const gasEstimation = await client.simulate(signerAddress, [msg], "")
  const fee = calculateFee(
    Math.round(gasEstimation * GHOSTCLOUD_GAS_LIMIT_MULTIPLIER),
    GHOSTCLOUD_GAS_PRICE,
  )
  const memo = `invoice_id: ${invoiceId}, payment_id: ${paymentId}, purchase_id: ${purchaseId}`
  return await client.signAndBroadcast(signerAddress, [msg], fee, memo)
}
