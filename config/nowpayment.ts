export const API_KEY = process.env.NEXT_PUBLIC_NOWPAYMENT_API_KEY ?? "INVALID"
export const PRICE_AMOUNT = process.env.NEXT_PUBLIC_NOWPAYMENT_PRICE_AMOUNT ?? 5
export const PRICE_CURRENCY =
  process.env.NEXT_PUBLIC_NOWPAYMENT_PRICE_CURRENCY ?? "usd"
export const PAY_CURRENCY =
  process.env.NEXT_PUBLIC_NOWPAYMENT_PAY_CURRENCY ?? "ATOM"
export const IS_FIXED_RATE =
  process.env.NEXT_PUBLIC_NOWPAYMENT_IS_FIXED_RATE ?? true
export const IS_FEE_PAID_BY_USER =
  process.env.NEXT_PUBLIC_NOWPAYMENT_IS_FEE_PAID_BY_USER ?? true
const API_SUBDOMAIN =
  process.env.NEXT_PUBLIC_NOWPAYMENT_API_SUBDOMAIN ?? "api-sandbox"
export const IPN_CALLBACK_URL =
  process.env.NEXT_PUBLIC_NOWPAYMENT_IPN_CALLBACK_URL ??
  "https://localhost:3000/api/ipn"
export const PAYMENT_SUCCESS_URL =
  process.env.NEXT_PUBLIC_NOWPAYMENT_SUCCESS_REDIRECT_URL ??
  "http://localhost:3000/success"
export const API_STATUS_ENDPOINT = `https://${API_SUBDOMAIN}.nowpayments.io/v1/status`
export const API_CREATE_INVOICE_ENDPOINT = `https://${API_SUBDOMAIN}.nowpayments.io/v1/invoice`

const API_PAYMENT_STATUS_ENDPOINT = `https://${API_SUBDOMAIN}.nowpayments.io/v1/payment`
export const getPaymentStatus = async (id: string) => {
  const myHeaders = new Headers()
  myHeaders.append("x-api-key", API_KEY)

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as RequestRedirect,
  }

  return await fetch(`${API_PAYMENT_STATUS_ENDPOINT}/${id}`, requestOptions)
}
