import { useColorMode } from "@chakra-ui/react"
import { web3AuthInitProvider } from "../../lib/web3-auth"
import {
  GHOSTCLOUD_CHAIN_CONFIG,
  GHOSTCLOUD_UI_CONFIG,
} from "../../config/ghostcloud-chain"
import useWeb3AuthStore from "../../store/web3-auth"
import { useRouter } from "next/router"
import { useMutation } from "react-query"
import { useDisplayError } from "../../helpers/toast"

export const useHandleLogin = () => {
  const { colorMode } = useColorMode() // To pass the color mode to Web3Auth
  const store = useWeb3AuthStore() // To access the provider
  const router = useRouter() // To redirect on logout
  const displayError = useDisplayError()

  const login = async () => {
    if (!store.isConnected()) {
      const uiConfig = {
        ...GHOSTCLOUD_UI_CONFIG,
        mode: colorMode,
      }
      await web3AuthInitProvider(GHOSTCLOUD_CHAIN_CONFIG, uiConfig)
    }
    const newPath =
      router.pathname === "/dashboard" ? router.asPath : "/dashboard"
    await router.push(newPath)
  }

  return useMutation(login, {
    onError: (error: unknown) => {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to login", err)
    },
  })
}
