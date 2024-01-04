export enum PaymentStatus {
  waiting = "waiting",
  confirming = "confirming",
  confirmed = "confirmed",
  sending = "sending",
  partially_paid = "partially_paid",
  finished = "finished",
  failed = "failed",
  refunded = "refunded",
  expired = "expired",
}

export interface PaymentStatusResponse {
  payment_id: number
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  actually_paid: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: number
  created_at: string
  updated_at: string
  outcome_amount: number
  outcome_currency: string
  invoice_id: number
}

export function isPaymentStatusResponse(data: any) {
  return (
    data &&
    typeof data === "object" &&
    "payment_id" in data &&
    "payment_status" in data &&
    data.payment_status in PaymentStatus &&
    "pay_address" in data &&
    "price_amount" in data &&
    "price_currency" in data &&
    "pay_amount" in data &&
    "actually_paid" in data &&
    "pay_currency" in data &&
    "order_id" in data &&
    "order_description" in data &&
    "purchase_id" in data &&
    "created_at" in data &&
    "updated_at" in data &&
    "outcome_amount" in data &&
    "outcome_currency" in data
  )
}
