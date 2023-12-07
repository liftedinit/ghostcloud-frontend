import { useFetchBalance } from "../lib/ghostcloud"
import { Box, Flex, Spinner, useColorModeValue } from "@chakra-ui/react"

export default function BalanceDisplay() {
  const { data: balance, isLoading: isBalanceLoading } = useFetchBalance()
  const addrBgColor = useColorModeValue(
    "modes.dark.altBackground",
    "modes.light.altBackground",
  )
  const addrFgColor = useColorModeValue("modes.dark.text", "modes.light.text")
  return (
    <Flex alignItems={"center"}>
      <Box>Balance:</Box>
      <Box
        ml={2}
        px={1}
        borderRadius="md"
        backgroundColor={addrBgColor}
        color={addrFgColor}
      >
        {isBalanceLoading ? (
          <Spinner />
        ) : (
          `${balance?.amount} ${balance?.denom}`
        )}
      </Box>
    </Flex>
  )
}
