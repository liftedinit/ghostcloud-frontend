import React from "react"
import {
  cosmos,
  cosmosAminoConverters,
  cosmosProtoRegistry,
  ghostcloud,
  ghostcloudAminoConverters,
  ghostcloudProtoRegistry,
} from "@liftedinit/gcjs"
import {
  GHOSTCLOUD_ADDRESS_PREFIX,
  GHOSTCLOUD_DENOM,
  GHOSTCLOUD_GAS_LIMIT_MULTIPLIER,
  GHOSTCLOUD_GAS_PRICE,
  GHOSTCLOUD_REST_TARGET,
  GHOSTCLOUD_RPC_TARGET,
} from "../config/ghostcloud-chain"
import useWeb3AuthStore from "../store/web3-auth"
import {
  DirectSecp256k1Wallet,
  OfflineDirectSigner,
  GeneratedType,
  Registry,
} from "@cosmjs/proto-signing"
import { DeploymentData } from "../components/create-deployment"
import { fileToArrayBuffer } from "../helpers/files"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import {
  QueryMetasResponse,
  QueryMetasResponseSDKType,
} from "@liftedinit/gcjs/dist/codegen/ghostcloud/ghostcloud/query"
import {
  AminoTypes,
  calculateFee,
  Coin,
  SigningStargateClient,
} from "@cosmjs/stargate"
import { fromHex } from "@cosmjs/encoding"
import { useLcdQueryClient } from "../hooks/useLcdQueryClient"

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
  const create = async (data: DeploymentData | null) => {
    if (!data) {
      throw new Error("Deployment data is empty.")
    }

    const creator = await store.getAddress()
    if (!creator) {
      throw new Error("Creator address is empty.")
    }

    const client = await createGhostcloudRpcClient(
      fromHex(await store.getPrivateKey()),
    )
    const msg = await createDeploymentMsg(data, creator)
    const gasEstimation = await client.simulate(creator, [msg], "")
    const fee = calculateFee(
      Math.round(gasEstimation * GHOSTCLOUD_GAS_LIMIT_MULTIPLIER),
      GHOSTCLOUD_GAS_PRICE,
    )
    const response = await client.signAndBroadcast(
      creator,
      [msg],
      fee,
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
      queryClient.invalidateQueries({ queryKey: ["metas"] })
      queryClient.invalidateQueries({ queryKey: ["userBalance"] })
    },
  })
}

async function updateDeploymentMsg(data: DeploymentData, creator: string) {
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

  const { updateDeployment } = ghostcloud.ghostcloud.MessageComposer.withTypeUrl
  return updateDeployment({
    meta: {
      creator,
      name: data.name,
      description: data.description,
      domain: data.domain,
    },
    payload,
  })
}

export const useUpdateDeployment = () => {
  const store = useWeb3AuthStore()
  const queryClient = useQueryClient()
  const update = async (data: DeploymentData | null) => {
    if (!data) {
      throw new Error("Deployment data is empty.")
    }

    const creator = await store.getAddress()
    if (!creator) {
      throw new Error("Creator address is empty.")
    }

    const client = await createGhostcloudRpcClient(
      fromHex(await store.getPrivateKey()),
    )
    const msg = await updateDeploymentMsg(data, creator)
    const gasEstimation = await client.simulate(creator, [msg], "")
    const fee = calculateFee(
      Math.round(gasEstimation * GHOSTCLOUD_GAS_LIMIT_MULTIPLIER),
      GHOSTCLOUD_GAS_PRICE,
    )
    const response = await client.signAndBroadcast(
      creator,
      [msg],
      fee,
      data.memo,
    )

    if (response.code) {
      throw new Error(
        `Deployment update failed with error code: ${response.code}. Raw log: ${response.rawLog}`,
      )
    }

    return response
  }

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas"] })
      queryClient.invalidateQueries({ queryKey: ["userBalance"] })
    },
  })
}

async function removeDeploymentMsg(name: string, creator: string) {
  const { removeDeployment } = ghostcloud.ghostcloud.MessageComposer.withTypeUrl
  return removeDeployment({
    creator,
    name: name,
  })
}

export const useRemoveDeployment = () => {
  const store = useWeb3AuthStore()
  const queryClient = useQueryClient()
  const remove = async (name: string) => {
    const creator = await store.getAddress()
    if (!creator) {
      throw new Error("Creator address is empty.")
    }

    const client = await createGhostcloudRpcClient(
      fromHex(await store.getPrivateKey()),
    )
    const msg = await removeDeploymentMsg(name, creator)
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

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas"] })
      queryClient.invalidateQueries({ queryKey: ["userBalance"] })
    },
  })
}

const pageLimit = 10

// Query the Ghostcloud REST endpoint for deployments created by the current user
export const useFetchMetas = (): [
  UseQueryResult<QueryMetasResponseSDKType | undefined, unknown>,
  number,
  number,
  (direction: string) => void,
] => {
  const [pageCount, setPageCount] = React.useState<number>(0)
  const [page, setPage] = React.useState(0)
  const store = useWeb3AuthStore()
  const { lcdQueryClient } = useLcdQueryClient()

  const list = async () => {
    const address = await store.getAddress()
    if (!lcdQueryClient) {
      throw new Error("LCD Client not ready")
    }

    if (address) {
      const filter = ghostcloud.ghostcloud.Filter.fromPartial({
        field: ghostcloud.ghostcloud.Filter_Field.CREATOR,
        operator: ghostcloud.ghostcloud.Filter_Operator.EQUAL,
        value: address,
      })
      const pagination = cosmos.base.query.v1beta1.PageRequest.fromPartial({
        limit: BigInt(pageLimit),
        countTotal: true,
        offset: BigInt(pageLimit * page),
      })
      const request = ghostcloud.ghostcloud.QueryMetasRequest.fromPartial({
        filters: [filter],
        pagination,
      })
      const res = await lcdQueryClient.ghostcloud.ghostcloud.metas(request)

      if (res.pagination?.total ?? 0 > 0) {
        setPageCount(Math.ceil(Number(res.pagination?.total) / pageLimit))
      }

      return res
    }
  }

  const query = useQuery({
    queryKey: ["metas", page],
    queryFn: list,
    meta: {
      errorMessage: "Failed to fetch deployments",
    },
    placeholderData: keepPreviousData,
  })

  const handlePageClick = (direction: string) => {
    setPage(old =>
      direction === "next"
        ? Math.min(old + 1, pageCount - 1)
        : Math.max(old - 1, 0),
    )
  }

  return [query, page + 1, pageCount, handlePageClick]
}

export const useFetchBalance = (): UseQueryResult<Coin, Error> => {
  const store = useWeb3AuthStore()
  const { lcdQueryClient } = useLcdQueryClient()

  const fetchBalance = async () => {
    if (!lcdQueryClient) {
      throw new Error("LCD Client not ready")
    }

    const address = await store.getAddress()
    if (address) {
      const response = await lcdQueryClient.cosmos.bank.v1beta1.balance({
        address,
        denom: GHOSTCLOUD_DENOM,
      })

      if (response.balance) {
        return response.balance
      } else {
        throw new Error("No balance available")
      }
    }
  }

  return useQuery({
    queryKey: ["userBalance"],
    queryFn: fetchBalance,
    meta: {
      errorMessage: "Failed to fetch balance",
    },
  })
}

export const useFetchAddress = (): UseQueryResult<string, Error> => {
  const store = useWeb3AuthStore()

  const fetchAddress = async () => {
    const address = await store.getAddress()
    if (address) {
      return address
    } else {
      throw new Error("No address available")
    }
  }

  return useQuery({
    queryKey: ["address"],
    queryFn: fetchAddress,
    meta: {
      errorMessage: "Failed to fetch address",
    },
  })
}
