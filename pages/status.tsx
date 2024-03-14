import { useFetchMetas } from "../lib/ghostcloud"
import { useEffect, useState } from "react"
import useWeb3AuthStore from "../store/web3-auth"
import useOpenLoginSession from "../hooks/useOpenLoginSession"
import {
  Box,
  Card,
  Container,
  Flex,
  Heading,
  Icon,
  Spinner,
  Text,
  useTheme,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { IoIosCheckmarkCircle, IoIosWarning } from "react-icons/io"

interface StatusCardProps {
  error: boolean
  msg: string
}

const StatusCard = ({ error, msg }: StatusCardProps) => {
  const theme = useTheme()

  return (
    <Card mb={5} p={5}>
      <Flex align="center">
        <Flex mr={2}>
          <Icon
            as={error ? IoIosWarning : IoIosCheckmarkCircle}
            boxSize={7}
            color={error ? theme.colors.red[400] : theme.colors.green[400]}
          />
        </Flex>
        <Heading as="h2" size="md" my={2}>
          {msg}
        </Heading>
      </Flex>
    </Card>
  )
}

const Status = () => {
  const store = useWeb3AuthStore()
  const isConnected = store.isConnected()
  const router = useRouter()
  const [{ data: metas, isLoading: isMetaLoading, refetch: refetchMetas }] =
    useFetchMetas(false)
  const { pagination: { total = 0 } = {} } = metas || {}
  const [error, setError] = useState(false)
  const [updated, setUpdated] = useState("")
  const hasSession = useOpenLoginSession()

  // Redirect if not logged in
  useEffect(() => {
    if (!isMetaLoading && !isConnected && !hasSession) {
      router.push("/")
    }
  }, [isConnected, isMetaLoading, hasSession, router])

  // Ensure that we get metas on refresh once we are connected
  useEffect(() => {
    if (hasSession && isConnected && !metas?.meta) {
      refetchMetas()
      setUpdated(new Date().toLocaleString())
    }
  }, [hasSession, isConnected, metas, refetchMetas])

  // Refetch metas every 30 seconds
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      refetchMetas()
      setUpdated(new Date().toLocaleString())
      if (!isMetaLoading && !metas?.meta) {
        setError(true)
      }
    }, 30000)

    return () => {
      clearInterval(heartbeatInterval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasSession && !isConnected && isMetaLoading) {
    return (
      <Flex sx={{ height: "50vh" }} justify={"center"} align={"center"}>
        <Spinner />
      </Flex>
    )
  }

  return (
    <div>
      <Container maxW="4xl" minH={"80vh"}>
        <Box py={10}>
          <Heading as="h1" size="xl" mt={6} mb={5}>
            System Status
          </Heading>
          <Text mb={5}>Last Updated: {updated}</Text>

          <StatusCard
            error={error}
            msg={error ? "Systems Degraded" : "All Systems Operational"}
          />

          {metas?.meta && metas.meta.length > 0 && (
            <StatusCard
              error={error}
              msg={
                error
                  ? "Systems Degraded"
                  : `${total.toString()} Deployment${
                      total > 1 ? "s" : ""
                    } Active`
              }
            />
          )}
        </Box>
      </Container>
    </div>
  )
}
export default Status
