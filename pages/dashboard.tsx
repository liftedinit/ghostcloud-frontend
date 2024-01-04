import useWeb3AuthStore from "../store/web3-auth"
import DashboardComponent from "../components/dashboard"
import { Box, Container, Grid, GridItem } from "@chakra-ui/react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useGetPaymentStatus } from "../hooks/payment/get-payment-status"
import { useDisplayError, useDisplaySuccess } from "../helpers/toast"
import { getMsgFromPaymentStatus } from "../helpers/payment"
import { PaymentStatus, PaymentStatusResponse } from "../types/payment/types"
import { isTokenTransferSuccessful } from "../lib/ghostcloud"
import { GHOSTCLOUD_BANK_ACCOUNT_ADDRESS } from "../config/ghostcloud-chain"
import { useHandleLogin } from "../hooks/auth/handle-login"

const getHashFromPaymentStatus = async (
  paymentStatus: PaymentStatusResponse,
  address: string,
) => {
  if (paymentStatus.payment_status !== PaymentStatus.finished) return ""

  const response = await isTokenTransferSuccessful(
    GHOSTCLOUD_BANK_ACCOUNT_ADDRESS,
    address,
    paymentStatus.invoice_id,
    paymentStatus.payment_id,
    paymentStatus.purchase_id,
  )

  return response?.txResponse?.txhash ?? "ERROR"
}

export default function Dashboard() {
  const router = useRouter()
  const NP_id = router.query.NP_id?.toString() ?? ""
  const { isConnected, getAddress } = useWeb3AuthStore()
  const { data: paymentStatus } = useGetPaymentStatus(NP_id)
  const { mutate: handleLogin } = useHandleLogin()
  const displaySuccess = useDisplaySuccess()
  const displayError = useDisplayError()

  // TODO: Better way to handle this to re-connect to the session
  useEffect(() => {
    if (!isConnected()) handleLogin()
  }, [handleLogin, isConnected])

  // Display the payment status, if any
  useEffect(() => {
    const process = async () => {
      if (!paymentStatus) return
      const address = await getAddress()
      if (!address) {
        displayError("Error during submission", new Error("No address found"))
        return
      }

      const hash = await getHashFromPaymentStatus(paymentStatus, address)
      const { success, msg } = getMsgFromPaymentStatus(paymentStatus, hash)
      success
        ? displaySuccess(`Payment Id ${paymentStatus.payment_id}`, msg)
        : displayError(
            `Payment Status ${paymentStatus.payment_status}`,
            new Error(msg?.toString()),
          )
    }
    process()
  }, [paymentStatus])

  return isConnected() ? (
    <Container maxW="6xl" minH={"80vh"}>
      <Box py={8}>
        <Grid templateColumns={`repeat(3, 1fr)`}>
          <GridItem colSpan={3}>
            <DashboardComponent />
          </GridItem>
        </Grid>
      </Box>
    </Container>
  ) : (
    <center style={{ color: "red" }}>Please login to view this page</center>
  )
}
