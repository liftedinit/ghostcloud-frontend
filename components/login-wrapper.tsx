import React from "react"
import useWeb3AuthStore from "../store/web3-auth"
import useAuthHandlers from "../hooks/useAuthHandlers"

const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = useWeb3AuthStore()
  const { handleLogin } = useAuthHandlers()
  const [hasLoginAttempt, setHasLoginAttempt] = React.useState(false)

  React.useEffect(() => {
    const openLoginStore = window.localStorage.getItem("openlogin_store")

    if (!openLoginStore) return
    const { sessionId } = JSON.parse(openLoginStore)

    if (sessionId.length && !hasLoginAttempt) {
      handleLogin(false)
      setHasLoginAttempt(true)
    }
  }, [handleLogin, hasLoginAttempt, store])

  return <>{children}</>
}

export default LoginWrapper
