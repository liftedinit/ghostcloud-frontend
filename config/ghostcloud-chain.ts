// This file contains the configuration for the Ghostcloud chain.

import { ChainNamespaceType, CustomChainConfig } from "@web3auth/base"
import { UIConfig } from "@web3auth/ui"

export const GHOSTCLOUD_ADDRESS_PREFIX =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_ADDRESS_PREFIX"] ?? "gc"
export const GHOSTCLOUD_RPC_TARGET =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_RPC_TARGET"] ??
  "https://rpc.testnet.ghostcloud.org"
export const GHOSTCLOUD_CHAIN_NAMESPACE = (process.env[
  "NEXT_PUBLIC_GHOSTCLOUD_CHAIN_NAMESPACE"
] ?? "other") as ChainNamespaceType
export const GHOSTCLOUD_DISPLAY_NAME =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_DISPLAY_NAME"] ?? "Ghostcloud"
export const GHOSTCLOUD_CHAIN_ID =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_CHAIN_ID"] ?? "gc-testnet-1"
export const GHOSTCLOUD_DENOM =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_DENOM"] ?? "token"
export const GHOSTCLOUD_URL_DOMAIN =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_URL_DOMAIN"] ?? "localhost:8880"
export const GHOSTCLOUD_URL_SCHEME =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_URL_SCHEME"] ?? "http"
export const GHOSTCLOUD_CREATE_FEE =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_CREATE_FEE"] ?? "1"
export const GHOSTCLOUD_UPDATE_FEE =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_UPDATE_FEE"] ?? "1"
export const GHOSTCLOUD_REMOVE_FEE =
  process.env["NEXT_PUBLIC_GHOSTCLOUD_REMOVE_FEE"] ?? "1"
export const GHOSTCLOUD_LIGHT_LOGO = "/logo192-black.png"
export const GHOSTCLOUD_DARK_LOGO = "/logo192-white.png"
export const GHOSTCLOUD_MODAL_PRIMARY_COLOR = "gray"

export const GHOSTCLOUD_CHAIN_CONFIG = {
  chainNamespace: GHOSTCLOUD_CHAIN_NAMESPACE,
  chainId: GHOSTCLOUD_CHAIN_ID,
  displayName: GHOSTCLOUD_DISPLAY_NAME,
  rpcTarget: GHOSTCLOUD_RPC_TARGET,
} as unknown as CustomChainConfig

export const GHOSTCLOUD_UI_CONFIG = {
  appName: GHOSTCLOUD_DISPLAY_NAME,
  logoDark: GHOSTCLOUD_DARK_LOGO,
  logoLight: GHOSTCLOUD_LIGHT_LOGO,
  theme: {
    primary: GHOSTCLOUD_MODAL_PRIMARY_COLOR,
  },
} as unknown as UIConfig
