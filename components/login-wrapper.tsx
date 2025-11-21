import React from "react"
import useAuthHandlers from "@/hooks/useAuthHandlers"
import useOpenLoginSession from "@/hooks/useOpenLoginSession"

const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  const { handleLogin } = useAuthHandlers()
  const [hasLoginAttempt, setHasLoginAttempt] = React.useState(false)
  const hasSession = useOpenLoginSession()

  React.useEffect(() => {
    if (hasSession && !hasLoginAttempt) {
      handleLogin({}, false)
      setHasLoginAttempt(true)
    }
  }, [handleLogin, hasLoginAttempt, hasSession])

  return <>{children}</>
}

export default LoginWrapper
