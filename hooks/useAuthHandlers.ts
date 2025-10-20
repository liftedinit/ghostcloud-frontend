// Handle the login and logout actions, and fetch the address from the provider

import { useColorMode, useToast } from "@chakra-ui/react"
import { web3AuthInitProvider } from "../lib/web3-auth"
import { GHOSTCLOUD_UI_CONFIG } from "../config/ghostcloud-chain"
import useWeb3AuthStore from "../store/web3-auth"
import { useRouter } from "next/router"

export default function useAuthHandlers() {
  const { colorMode } = useColorMode() // To pass the color mode to Web3Auth
  const store = useWeb3AuthStore() // To access the provider
  const toast = useToast() // To display errors
  const router = useRouter() // To redirect on logout

  // Handle the login to Web3Auth.
  // Redirect to the dashboard if the user is already connected.
  const handleLogin = async (
    ev: any,
    redirectToDashboard: boolean | null = null,
  ) => {
    if (!store.isConnected()) {
      const uiConfig = {
        ...GHOSTCLOUD_UI_CONFIG,
        mode: colorMode,
      }
      try {
        await web3AuthInitProvider(uiConfig)
      } catch (error) {
        toast({
          title: "An error occurred while trying to login",
          description: (error as Error).message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        })
      }
    }
    redirectToDashboard && (await router.push("/dashboard"))
  }

  // Handle the logout from Web3Auth.
  // Redirect to the homepage after logout.
  const handleLogout = async () => {
    store.logout()
    await router.push("/") // Return to the homepage
  }

  return { handleLogin, handleLogout }
}
