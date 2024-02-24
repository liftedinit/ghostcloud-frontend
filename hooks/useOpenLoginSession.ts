import { useState, useEffect } from "react"
import useWeb3AuthStore from "../store/web3-auth"

function useOpenLoginSession() {
  const store = useWeb3AuthStore()
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const openLoginStore = window.localStorage.getItem("openlogin_store")
    if (!openLoginStore) {
      setHasSession(false)
      return
    }
    const { sessionId } = JSON.parse(openLoginStore)
    setHasSession(!!sessionId)
  }, [store])

  return hasSession
}

export default useOpenLoginSession
