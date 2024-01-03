import { useDisplayError } from "../../helpers/errors"
import { API_STATUS_ENDPOINT } from "../../config/nowpayment"
import { useQuery } from "react-query"

// Check the NOWPayments API status
export const useCheckApiStatus = () => {
  const displayError = useDisplayError()
  const checkApiStatus = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    }

    const response = await fetch(API_STATUS_ENDPOINT, requestOptions)
    if (!response.ok) {
      throw new Error(`Failed to check API status: ${response.statusText}`)
    }

    return response
  }

  return useQuery({
    queryKey: "apiStatus",
    queryFn: checkApiStatus,
    onError: error => {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to check API status", err)
    },
  })
}
