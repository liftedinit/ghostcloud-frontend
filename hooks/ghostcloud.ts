// Create a deployment message from the given deployment data
// Send a deployment creation transaction to the Ghostcloud RPC endpoint
import useWeb3AuthStore from "../store/web3-auth"
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query"
import { DeploymentData } from "../components/create-deployment"
import {
  createDeployment,
  fetchBalance,
  listDeployments,
  removeDeployment,
  updateDeployment,
} from "../lib/ghostcloud"
import { QueryMetasResponse } from "@liftedinit/gcjs/dist/codegen/ghostcloud/ghostcloud/query"
import { useDisplayError } from "../helpers/errors"
import { Coin } from "@cosmjs/stargate"

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

    const pk = await store.getPrivateKey()
    if (!pk) {
      throw new Error("Private key is empty.")
    }
    return createDeployment(data, creator, pk)
  }

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "metas" })
      queryClient.invalidateQueries({ queryKey: "balance" })
    },
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
    const pk = await store.getPrivateKey()
    if (!pk) {
      throw new Error("Private key is empty.")
    }
    return updateDeployment(data, creator, pk)
  }

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "metas" })
      queryClient.invalidateQueries({ queryKey: "balance" })
    },
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
    const pk = await store.getPrivateKey()
    if (!pk) {
      throw new Error("Private key is empty.")
    }
    return removeDeployment(name, creator, pk)
  }

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "metas" })
      queryClient.invalidateQueries({ queryKey: "balance" })
    },
  })
}

// Query the Ghostcloud RPC endpoint for deployments created by the current user
export const useListDeployments = (): UseQueryResult<
  QueryMetasResponse,
  Error
> => {
  const store = useWeb3AuthStore()
  const displayError = useDisplayError()

  const list = async () => {
    const address = await store.getAddress()
    if (!address) {
      throw new Error("Failed to fetch address from the store")
    }
    return listDeployments(address)
  }

  return useQuery({
    queryKey: "metas",
    queryFn: list,
    onError: error => {
      displayError("Failed to fetch deployments", error)
    },
  })
}
export const useFetchBalance = (): UseQueryResult<Coin, Error> => {
  const store = useWeb3AuthStore()
  const displayError = useDisplayError()

  const fetchAccBalance = async () => {
    const address = await store.getAddress()
    if (!address) {
      throw new Error("Failed to fetch address from the store")
    }
    return fetchBalance(address)
  }

  return useQuery({
    queryKey: "balance",
    queryFn: fetchAccBalance,
    onError: error => {
      displayError("Failed to fetch balance", error)
    },
  })
}

export const useFetchAddress = (): UseQueryResult<string, Error> => {
  const store = useWeb3AuthStore()
  const displayError = useDisplayError()

  const fetchAddress = async () => {
    const address = await store.getAddress()
    if (address) {
      return address
    } else {
      throw new Error("Failed to fetch address")
    }
  }

  return useQuery({
    queryKey: "address",
    queryFn: fetchAddress,
    onError: error => {
      displayError("Failed to fetch address", error)
    },
  })
}
