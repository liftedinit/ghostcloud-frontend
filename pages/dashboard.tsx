import useWeb3AuthStore from "../store/web3-auth"
import DashboardComponent from "../components/dashboard"
import { Box, Container, Grid, GridItem } from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import useAuthHandlers from "../hooks/useAuthHandlers"

export default function Dashboard() {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()
  const { handleLogin } = useAuthHandlers()
  const memoizedLogin = useMemo(() => handleLogin, [])

  // TODO: Better way to handle this to re-connect to the session
  useEffect(() => {
    if (!isConnected) {
      memoizedLogin()
    }
  }, [memoizedLogin])

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
