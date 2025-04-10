import { Web3Auth } from "@web3auth/modal"
import {
  WEB3AUTH_ADAPTER_SETTINGS,
  WEB3AUTH_CLIENT_ID,
  WEB3AUTH_LOGIN_SETTINGS,
  WEB3AUTH_MODAL_CONFIG,
  WEB3AUTH_NETWORK,
} from "../config/web3-auth"
import useWeb3AuthStore from "../store/web3-auth"
import { CustomChainConfig } from "@web3auth/base"
import { UIConfig } from "@web3auth/ui"
import { CommonPrivateKeyProvider } from "@web3auth/base-provider"
import { AuthAdapter } from "@web3auth/auth-adapter"

// Initialize the Web3Auth provider using the provided chain and UI configs.
// This function initializes the Web3Auth login modal and connects to the provider.
export async function web3AuthInitProvider(
  chainConfig: CustomChainConfig,
  uiConfig: UIConfig,
) {
  try {
    const commonPrivateKeyProvider = new CommonPrivateKeyProvider({
      config: {
        chainConfig,
      },
    })

    const web3auth = new Web3Auth({
      clientId: WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: WEB3AUTH_NETWORK,
      chainConfig: chainConfig,
      uiConfig: uiConfig,
      privateKeyProvider: commonPrivateKeyProvider,
    })
    const authAdapter = new AuthAdapter({
      adapterSettings: WEB3AUTH_ADAPTER_SETTINGS,
      loginSettings: WEB3AUTH_LOGIN_SETTINGS,
    })
    web3auth.configureAdapter(authAdapter)

    await web3auth.initModal({
      modalConfig: WEB3AUTH_MODAL_CONFIG,
    })

    const provider = await web3auth.connect()

    useWeb3AuthStore.getState().setProvider(provider)
    useWeb3AuthStore.getState().setWeb3Auth(web3auth)

    return provider
  } catch (error) {}
}
