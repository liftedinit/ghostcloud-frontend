import { useDisplayError } from "../../helpers/toast"
import { useQuery } from "react-query"
import { isTokenTransferSuccessful } from "../../lib/ghostcloud"

export const useVerifyTokenTransfer = (
  sender: string,
  recipient: string,
  invoiceId: string,
  paymentId: string,
  purchaseId: string,
) => {
  const displayError = useDisplayError()

  return useQuery({
    queryKey: ["tokenTransferStatus"],
    queryFn: () =>
      isTokenTransferSuccessful(
        sender,
        recipient,
        invoiceId,
        paymentId,
        purchaseId,
      ),
    onError: error => {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to get status", err)
    },
    enabled: !!paymentId,
  })
}
