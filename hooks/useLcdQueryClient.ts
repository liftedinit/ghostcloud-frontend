import { liftedinit } from "@liftedinit/gcjs"
import { useQuery } from "@tanstack/react-query"
import { GHOSTCLOUD_REST_TARGET } from "../config/ghostcloud-chain"

const createLcdQueryClient = liftedinit.ClientFactory.createLCDClient

export const useLcdQueryClient = () => {
  const lcdQueryClient = useQuery({
    queryKey: ["lcdQueryClientCosmos", GHOSTCLOUD_REST_TARGET],
    queryFn: () =>
      createLcdQueryClient({
        restEndpoint: GHOSTCLOUD_REST_TARGET,
      }),
    enabled: !!GHOSTCLOUD_REST_TARGET,
    staleTime: Infinity,
  })

  return {
    lcdQueryClient: lcdQueryClient.data,
  }
}
