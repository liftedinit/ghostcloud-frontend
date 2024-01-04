// Check the NOWPayments API status
import { useDisplayError } from "../../helpers/toast"
import { getPaymentStatus } from "../../config/nowpayment"
import { useQuery } from "react-query"
import {
  isPaymentStatusResponse,
  PaymentStatusResponse,
} from "../../types/payment/types"

export const useGetPaymentStatus = (id: string) => {
  const displayError = useDisplayError()
  const paymentStatus = async (id: string): Promise<PaymentStatusResponse> => {
    const response = await getPaymentStatus(id)
    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`)
    }

    const data = await response.json()
    if (!isPaymentStatusResponse(data)) {
      throw new Error("Invalid payment status response")
    }
    return data
  }

  return useQuery({
    queryKey: ["paymentStatus", id],
    queryFn: () => paymentStatus(id),
    onError: error => {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to get status", err)
    },
    enabled: !!id,
  })
}
