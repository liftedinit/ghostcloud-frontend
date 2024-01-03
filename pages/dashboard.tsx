import useWeb3AuthStore from "../store/web3-auth"
import DashboardComponent from "../components/dashboard"
import { Box, Container, Grid, GridItem } from "@chakra-ui/react"
import { useEffect } from "react"
import { useHandleLogin } from "../hooks/auth/handle-login"

export default function Dashboard() {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()
  const { mutate: handleLogin } = useHandleLogin()

  // TODO: Better way to handle this to re-connect to the session
  useEffect(() => {
    if (!isConnected) {
      handleLogin()
    }
  }, [handleLogin, isConnected])

  return isConnected ? (
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
