export const chainName = "ghostcloud"

function isProd() {
  return process.env.NODE_ENV == "production"
}

export const rpcEndpoint = isProd()
  ? "https://rpc.ghostcloud.org"
  : "http://localhost:26657"
