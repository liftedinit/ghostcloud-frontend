import { create } from "zustand"
import { IProvider } from "@web3auth/base"
import { Web3Auth } from "@web3auth/modal"
import { GHOSTCLOUD_ADDRESS_PREFIX } from "../config/ghostcloud-chain"
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing"
import { hexToBytes } from "@metamask/utils"

interface Web3AuthState {
  provider: IProvider | null
  web3auth: Web3Auth | null
  setProvider: (provider: IProvider | null) => void
  setWeb3Auth: (web3auth: Web3Auth | null) => void
  isConnected: () => boolean
  isLoading: () => boolean
  getPrivateKey: () => Promise<any>
  getAddress: () => Promise<string | null>
  logout: () => void
}

const useWeb3AuthStore = create<Web3AuthState>((set, get) => ({
  provider: null,
  web3auth: null,
  setProvider: (provider: IProvider | null) => set({ provider }),
  setWeb3Auth: (web3auth: Web3Auth | null) => set({ web3auth }),
  isConnected: () => {
    return get().web3auth?.connected ?? false
  },
  isLoading: () => {
    return !get().web3auth && !get().provider
  },
  getPrivateKey: async () => {
    const provider = get().provider
    if (provider === null) {
      return null
    }
    try {
      return await provider.request({
        method: "private_key",
      })
    } catch (error) {
      return error
    }
  },
  getAddress: async () => {
    try {
      const buffer = await get().getPrivateKey()
      if (buffer === null) {
        return null
      }
      const privateKey = hexToBytes(buffer)
      const walletPromise = await DirectSecp256k1Wallet.fromKey(
        privateKey,
        GHOSTCLOUD_ADDRESS_PREFIX,
      )
      return (await walletPromise.getAccounts())[0].address
    } catch (error) {
      return error as string
    }
  },
  logout: () => {
    get().web3auth?.logout()
    set({ provider: null, web3auth: null })
  },
}))

export default useWeb3AuthStore
