import React from "react"
import useWeb3AuthStore from "../store/web3-auth"
import DashboardComponent from "../components/dashboard"
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import useOpenLoginSession from "../hooks/useOpenLoginSession"

export default function Dashboard() {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()
  const hasSession = useOpenLoginSession()
  const [hasTimedOut, setHasTimedOut] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(!hasSession && !isConnected)
    }, 500)

    return () => {
      if (!hasTimedOut) {
        clearTimeout(timer)
      }
    }
  }, [isConnected, hasSession]) // eslint-disable-line

  if (hasTimedOut) {
    return (
      <Container maxW="6xl">
        <Grid placeItems="center" minH={"10vh"}>
          <Center>
            <Box>
              <Alert status="error">
                <AlertIcon />
                Please login to view this page
              </Alert>
            </Box>
          </Center>
        </Grid>
      </Container>
    )
  }

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
  ) : null
}
