import { WEB3AUTH_NETWORK_TYPE } from "@web3auth/auth"

export const WEB3AUTH_CLIENT_ID =
  process.env["NEXT_PUBLIC_WEB3AUTH_CLIENT_ID"] ?? "invalid"
export const WEB3AUTH_NETWORK = process.env[
  "NEXT_PUBLIC_WEB3AUTH_NETWORK"
] as WEB3AUTH_NETWORK_TYPE
