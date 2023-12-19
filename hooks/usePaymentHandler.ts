import {
  API_CREATE_INVOICE_ENDPOINT,
  API_KEY,
  API_STATUS_ENDPOINT,
  IPN_CALLBACK_URL,
  IS_FEE_PAID_BY_USER,
  IS_FIXED_RATE,
  PAY_CURRENCY,
  PAYMENT_SUCCESS_URL,
  PRICE_AMOUNT,
  PRICE_CURRENCY,
} from "../config/nowpayment"
import useWeb3AuthStore from "../store/web3-auth"

export default function usePaymentHandler() {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()

  const checkApiStatus = async () => {
    console.log("checkApiStatus")
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    }

    await fetch(API_STATUS_ENDPOINT, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log("error", error))
  }

  const createInvoice = async () => {
    const myHeaders = new Headers()
    myHeaders.append("x-api-key", API_KEY)
    myHeaders.append("Content-Type", "application/json")

    if (!isConnected) {
      console.log("Wallet not connected")
      return
    }

    const address = await store.getAddress()
    if (!address) {
      console.log("Wallet address not found")
      return
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

    fetch(API_CREATE_INVOICE_ENDPOINT, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.invoice_url) {
          window.location.href = result.invoice_url
        } else {
          console.log("Invoice URL not found in response")
        }
      })
      .catch(error => console.log("error", error))
  }

  const handlePayment = async () => {
    await checkApiStatus()
    await createInvoice()
  }

  return { handlePayment }
}
