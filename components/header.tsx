import Image from "next/image"
import {
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link as ChakraLink,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import Link from "next/link"
import logoLight from "../public/logo-black.png"
import logoDark from "../public/logo-white.png"
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs"
import Menu from "./menu"
import AddressDisplay from "./address-display"
import { useEffect, useState } from "react"
import useWeb3AuthStore from "../store/web3-auth"

function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue(
    "modes.light.background",
    "modes.dark.background",
  )
  const logo = useColorModeValue(logoLight, logoDark)
  const store = useWeb3AuthStore()
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await store.getAddress()
      setAddress(address)
    }
    fetchAddress()
  }, [store])

  return (
    <header>
      <Container
        maxWidth="100%"
        borderBottom="1px solid"
        data-testid="header"
        bg={bgColor}
      >
        <Container maxW="4xl">
          <Grid templateColumns={`repeat(3, 1fr)`}>
            <GridItem
              colSpan={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              py={2}
            >
              {address ? <AddressDisplay address={address} /> : null}
            </GridItem>
            <GridItem
              colSpan={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              py={2}
            >
              <Link href="/" passHref>
                <Image src={logo} alt="Header Logo" height={16} width={206} />
              </Link>
            </GridItem>
            <GridItem
              colSpan={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              py={2}
            >
              <HStack spacing={4}>
                <Button
                  variant="outline"
                  px={0}
                  onClick={toggleColorMode}
                  justifySelf="end"
                >
                  <Icon
                    as={
                      colorMode === "light"
                        ? BsFillMoonStarsFill
                        : BsFillSunFill
                    }
                  />
                </Button>
                <Menu />
              </HStack>
            </GridItem>
          </Grid>
        </Container>
      </Container>
    </header>
  )
}

export default Header
