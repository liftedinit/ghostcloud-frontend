import { OPENLOGIN_NETWORK_TYPE, WALLET_ADAPTERS } from "@web3auth/base"

export const WEB3AUTH_CLIENT_ID =
  process.env["NEXT_PUBLIC_WEB3AUTH_CLIENT_ID"] ?? "invalid"
export const WEB3AUTH_NETWORK = process.env[
  "NEXT_PUBLIC_WEB3AUTH_NETWORK"
] as OPENLOGIN_NETWORK_TYPE

export const WEB3AUTH_MODAL_CONFIG = {
  [WALLET_ADAPTERS.OPENLOGIN]: {
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
