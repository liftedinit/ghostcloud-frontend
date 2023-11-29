import { getSigningGhostcloudClient, ghostcloud } from "@liftedinit/gcjs"
import {
  GHOSTCLOUD_ADDRESS_PREFIX,
  GHOSTCLOUD_RPC_TARGET,
} from "../config/ghostcloud-chain"
import useWeb3AuthStore from "../store/web3-auth"
import {
  DirectSecp256k1Wallet,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing"
import { DeploymentData } from "../components/create-deployment"
import { fileToArrayBuffer } from "../helpers/files"
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query"
import { QueryMetasResponse } from "@liftedinit/gcjs/dist/codegen/ghostcloud/ghostcloud/query"
import { DeliverTxResponse } from "@cosmjs/stargate"
import { useDisplayError } from "../helpers/errors"

// Create a client for sending transactions to Ghostcloud RPC endpoint
// The transaction signer is the given private key
async function createGhostcloudRpcClient(pk: Buffer) {
  const getSignerFromKey = async (): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1Wallet.fromKey(pk, GHOSTCLOUD_ADDRESS_PREFIX)
  }
  const signer: OfflineDirectSigner = await getSignerFromKey()

  return await getSigningGhostcloudClient({
    rpcEndpoint: GHOSTCLOUD_RPC_TARGET,
    signer: signer,
  })
}

// Create a deployment message from the given deployment data
async function createDeploymentMsg(data: DeploymentData, creator: string) {
  let payload
  if (data.file) {
    const buffer = await fileToArrayBuffer(data.file)
    payload = ghostcloud.ghostcloud.Payload.fromPartial({
      archive: ghostcloud.ghostcloud.Archive.fromPartial({
        type: ghostcloud.ghostcloud.ArchiveType.Zip,
        content: buffer,
      }),
    })
  }

  const { createDeployment } = ghostcloud.ghostcloud.MessageComposer.withTypeUrl
  return createDeployment({
    meta: {
      creator,
      name: data.name,
      description: data.description,
      domain: data.domain,
    },
    payload,
  })
}

// Send a deployment creation transaction to the Ghostcloud RPC endpoint
export const useCreateDeployment = () => {
  const store = useWeb3AuthStore()
  const queryClient = useQueryClient()
  const displayError = useDisplayError()
  const create = async (data: DeploymentData | null) => {
    console.log("Calling create deployment")
    if (!data) {
      throw new Error("Deployment data is empty.")
    }

    console.log("Data is okay")
    const creator = await store.getAddress()
    if (!creator) {
      throw new Error("Creator address is empty.")
    }

    console.log("Creator is okay")
    const client = await createGhostcloudRpcClient(
      Buffer.from(await store.getPrivateKey(), "hex"),
    )
    const msg = await createDeploymentMsg(data, creator)
    // TODO: Fix fees
    const response = await client.signAndBroadcast(
      creator,
      [msg],
      {
        amount: [{ denom: "token", amount: "1" }],
        gas: "100000000",
      },
      data.memo,
    )

    if (response.code) {
      throw new Error(
        `Deployment creation failed with error code: ${response.code}. Raw log: ${response.rawLog}`,
      )
    }

    return response
  }

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "metas" })
    },
    onError: error => {
      displayError("Deployment creation failed", error as Error)
    },
  })
}

// Query the Ghostcloud RPC endpoint for deployments created by the current user
export const useFetchMetas = (): UseQueryResult<QueryMetasResponse, Error> => {
  const store = useWeb3AuthStore()
  const displayError = useDisplayError()

  const list = async () => {
    const address = await store.getAddress()
    if (address) {
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
  }

  return useQuery({
    queryKey: "metas",
    queryFn: list,
    onError: error => {
      displayError("Failed to fetch deployments", error)
    },
  })
}
