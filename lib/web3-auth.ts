import { UIConfig, Web3Auth } from "@web3auth/modal"
import { WEB3AUTH_CLIENT_ID, WEB3AUTH_NETWORK } from "@/config/web3-auth"
import useWeb3AuthStore from "@/store/web3-auth"

// Initialize the Web3Auth provider using the provided chain and UI configs.
// This function initializes the Web3Auth login modal and connects to the provider.
export async function web3AuthInitProvider(uiConfig: UIConfig) {
  try {
    const web3auth = new Web3Auth({
      clientId: WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: WEB3AUTH_NETWORK,
      uiConfig: uiConfig,
    })

    await web3auth.init()

    const provider = await web3auth.connect()

    useWeb3AuthStore.getState().setProvider(provider)
    useWeb3AuthStore.getState().setWeb3Auth(web3auth)

    return provider
  } catch (error) {}
}
