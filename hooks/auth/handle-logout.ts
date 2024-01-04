import useWeb3AuthStore from "../../store/web3-auth"
import { useRouter } from "next/router"
import { useMutation } from "react-query"
import { useDisplayError } from "../../helpers/toast"

export const useHandleLogout = () => {
  const store = useWeb3AuthStore() // To access the provider
  const router = useRouter() // To redirect on logout
  const displayError = useDisplayError()

  const logout = async () => {
    store.logout()
    await router.push("/") // Return to the homepage
  }

  return useMutation(logout, {
    onError: (error: unknown) => {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to logout", err)
    },
  })
}
