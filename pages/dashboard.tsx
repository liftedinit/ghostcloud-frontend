import useWeb3AuthStore from "../store/web3-auth"
import DashboardComponent from "../components/dashboard"
import { Box, Container, Grid, GridItem } from "@chakra-ui/react"

export default function Dashboard() {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()

  return isConnected ? (
    <Container maxW="4xl" minH={"80vh"}>
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
