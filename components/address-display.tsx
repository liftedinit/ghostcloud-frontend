import {
  Box,
  Button,
  Flex,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react"
import { LuCopy, LuCopyCheck } from "react-icons/lu"
import { truncateAddress } from "../helpers/address"

export default function AddressDisplay({
  address,
}: Readonly<{ address: string }>) {
  const addrBgColor = useColorModeValue(
    "modes.dark.altBackground",
    "modes.light.altBackground",
  )
  const addrFgColor = useColorModeValue("modes.dark.text", "modes.light.text")
  const copyBgColor = useColorModeValue(
    "modes.light.background",
    "modes.dark.background",
  )
  const copyFgColor = useColorModeValue("modes.light.text", "modes.dark.text")
  const { hasCopied, onCopy } = useClipboard(address)

  return (
    <Flex alignItems={"center"}>
      <Box>Logged as</Box>
      <Box
        backgroundColor={addrBgColor}
        color={addrFgColor}
        ml={2}
        px={1}
        borderRadius="md"
      >
        {truncateAddress(address, 4)}
      </Box>
      <Button
        height="100%"
        backgroundColor={copyBgColor}
        color={copyFgColor}
        onClick={onCopy}
        justifySelf="end"
        _hover={{}}
        _active={{}}
        px={0}
      >
        {hasCopied ? <LuCopyCheck /> : <LuCopy />}
      </Button>
    </Flex>
  )
}
