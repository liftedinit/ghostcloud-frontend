import { PaymentStatus, PaymentStatusResponse } from "../types/payment/types"
import { Box, Text } from "@chakra-ui/react"
import { ReactNode } from "react"

const paymentStatusMessages: Record<PaymentStatus, string> = {
  [PaymentStatus.waiting]:
    "You have not paid yet. Please pay {amount} {currency} to {address}.",
  [PaymentStatus.confirming]:
    "You have paid {paid} {currency}. Please wait for confirmation.",
  [PaymentStatus.confirmed]:
    "You have paid {paid} {currency}. Please wait for the transaction to be processed.",
  [PaymentStatus.failed]: "You have failed to pay {amount} {currency}.",
  [PaymentStatus.expired]:
    "You have not paid {amount} {currency} to {address} within the time limit.",
  [PaymentStatus.partially_paid]:
    "You have paid {paid} {currency}. Please pay the remaining to {address}.",
  [PaymentStatus.sending]:
    "You have paid {paid} {currency}. Please wait for the transaction to be processed.",
  [PaymentStatus.refunded]: "You have been refunded {paid} {currency}.",
  [PaymentStatus.finished]: "",
}

const getFinishedPaymentStatusMessage = (
  response: PaymentStatusResponse,
  hash: string,
): ReactNode => (
  <Box>
    <Text fontSize={"sm"}>
      You have successfully paid{" "}
      <Text as="span" fontWeight="bold">
        {response.pay_amount} {response.pay_currency.toUpperCase()}
      </Text>
      .
    </Text>
    <Text fontSize={"sm"}>
      The transaction hash is{" "}
      <Text as="span" fontWeight="bold">
        {hash}
      </Text>
      .
    </Text>
  </Box>
)

export const getMsgFromPaymentStatus = (
  response: PaymentStatusResponse,
  hash: string,
) => {
  let msg: ReactNode
  let status = response.payment_status as PaymentStatus
  let success = true

  if (status === PaymentStatus.finished) {
    msg = getFinishedPaymentStatusMessage(response, hash)
  } else {
    msg = paymentStatusMessages[status]
      .replace("{amount}", response.pay_amount.toString())
      .replace("{currency}", response.pay_currency)
      .replace("{address}", response.pay_address)
      .replace("{paid}", response.actually_paid.toString())
      .replace("{status}", status)

    if (
      status === PaymentStatus.failed ||
      status === PaymentStatus.expired ||
      status === PaymentStatus.partially_paid ||
      status === PaymentStatus.refunded
    ) {
      success = false
    }
  }

  return { msg, success }
}
