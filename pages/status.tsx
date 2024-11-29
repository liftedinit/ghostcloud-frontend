import { useFetchBalance, useFetchMetas } from "../lib/ghostcloud"
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
  const [
    {
      data: metas,
      error: metaError,
      isLoading: isMetaLoading,
      refetch: refetchMetas,
    },
  ] = useFetchMetas(false)
  const { pagination: { total = 0 } = {} } = metas || {}
  const [hasMetaError, setHasMetaError] = useState(false)
  const [hasBalanceError, setHasBalanceError] = useState(false)
  const [updated, setUpdated] = useState("")
  const hasSession = useOpenLoginSession()
  const { error: balanceError } = useFetchBalance(false)

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

  useEffect(() => {
    setUpdated(new Date().toLocaleString())
    setHasBalanceError(!!balanceError)
  }, [balanceError])

  useEffect(() => {
    setUpdated(new Date().toLocaleString())
    setHasMetaError(!!metaError)
  }, [metaError])

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
            error={hasBalanceError}
            msg={
              hasBalanceError ? "Systems Degraded" : "All Systems Operational"
            }
          />

          {metas?.meta && metas.meta.length > 0 && (
            <StatusCard
              error={hasMetaError}
              msg={
                hasMetaError
                  ? "Deployments Degraded"
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
