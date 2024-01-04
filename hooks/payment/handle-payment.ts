import { useCheckApiStatus } from "./check-api-status"
import { useCreateInvoice } from "./create-invoice"
import { useDisplayError } from "../../helpers/toast"

// Handle the payment process
export default function useHandlePayment() {
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
