import { useCheckApiStatus } from "./useCheckApiStatus"
import { useCreateInvoice } from "./useCreateInvoice"
import { useDisplayError } from "../../helpers/errors"

// Handle the payment process
export default function usePaymentHandler() {
  const { isSuccess: apiStatusOk } = useCheckApiStatus()
  const { mutate: createInvoice } = useCreateInvoice()
  const displayError = useDisplayError()

  const handlePayment = async () => {
    if (!apiStatusOk) {
      return
    }

    try {
      createInvoice()
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to create invoice", err)
    }
  }

  return { handlePayment }
}
