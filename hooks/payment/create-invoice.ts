import useWeb3AuthStore from "../../store/web3-auth"
import { useDisplayError } from "../../helpers/errors"
import {
  API_CREATE_INVOICE_ENDPOINT,
  API_KEY,
  IPN_CALLBACK_URL,
  IS_FEE_PAID_BY_USER,
  IS_FIXED_RATE,
  PAY_CURRENCY,
  PAYMENT_SUCCESS_URL,
  PRICE_AMOUNT,
  PRICE_CURRENCY,
} from "../../config/nowpayment"
import { useMutation } from "react-query"

// Create an invoice with NOWPayments
export const useCreateInvoice = () => {
  const store = useWeb3AuthStore()
  const displayError = useDisplayError()

  const createInvoice = async () => {
    const myHeaders = new Headers()
    myHeaders.append("x-api-key", API_KEY)
    myHeaders.append("Content-Type", "application/json")

    if (!store.isConnected()) {
      throw new Error("Wallet not connected")
    }

    const address = await store.getAddress()
    if (!address) {
      throw new Error("Wallet address not found")
    }

    const raw = JSON.stringify({
      price_amount: PRICE_AMOUNT,
      price_currency: PRICE_CURRENCY,
      pay_currency: PAY_CURRENCY,
      is_fixed_rate: IS_FIXED_RATE,
      success_url: PAYMENT_SUCCESS_URL,
      is_fee_paid_by_user: IS_FEE_PAID_BY_USER,
      ipn_callback_url: IPN_CALLBACK_URL,
      order_description: "Token purchase for " + address,
    })

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    }

    const response = await fetch(
      API_CREATE_INVOICE_ENDPOINT,
      requestOptions,
    ).then(response => response.json())

    if (!response.invoice_url) {
      throw new Error("Invoice URL not found in response")
    }

    return response
  }

  return useMutation(createInvoice, {
    onError: (error: unknown) => {
      const err = error instanceof Error ? error : new Error("Unknown error")
      displayError("Failed to create invoice", err)
    },
    onSuccess: data => {
      window.location.href = data.invoice_url
    },
  })
}
