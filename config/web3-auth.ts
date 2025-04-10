import { WEB3AUTH_NETWORK_TYPE, WALLET_ADAPTERS, UX_MODE } from "@web3auth/base"
import { AuthOptions, LoginSettings, MFA_LEVELS } from "@web3auth/auth-adapter"

export const WEB3AUTH_CLIENT_ID =
  process.env["NEXT_PUBLIC_WEB3AUTH_CLIENT_ID"] ?? "invalid"
export const WEB3AUTH_NETWORK = process.env[
  "NEXT_PUBLIC_WEB3AUTH_NETWORK"
] as WEB3AUTH_NETWORK_TYPE

export const WEB3AUTH_ADAPTER_SETTINGS = {
  uxMode: UX_MODE.POPUP,
} as AuthOptions

export const WEB3AUTH_LOGIN_SETTINGS = {
  mfaLevel: MFA_LEVELS.OPTIONAL,
} as LoginSettings

export const WEB3AUTH_MODAL_CONFIG = {
  [WALLET_ADAPTERS.AUTH]: {
    label: "openlogin",
    loginMethods: {
      facebook: {
        name: "facebook",
        showOnModal: false,
      },
      reddit: {
        name: "reddit",
        showOnModal: false,
      },
      twitch: {
        name: "twitch",
        showOnModal: false,
      },
      discord: {
        name: "discord",
        showOnModal: false,
      },
      apple: {
        name: "apple",
        showOnModal: false,
      },
      line: {
        name: "line",
        showOnModal: false,
      },
      kakao: {
        name: "kakao",
        showOnModal: false,
      },
      linkedin: {
        name: "linkedin",
        showOnModal: false,
      },
      weibo: {
        name: "weibo",
        showOnModal: false,
      },
      wechat: {
        name: "wechat",
        showOnModal: false,
      },
      sms_passwordless: {
        name: "sms_passwordless",
        showOnModal: false,
      },
    },
  },
}
