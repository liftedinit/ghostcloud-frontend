import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Image from "next/image"
import { GoLock, GoShieldCheck, GoSmiley } from "react-icons/go"
import logoDark from "../public/logo192-white.png"
import logoLight from "../public/logo192-black.png"
import heroDark from "../public/hero-dark.png"
import heroLight from "../public/hero-light.png"
import React from "react"
import { Feature } from "../components"
import { useHandleLogin } from "../hooks/auth/handle-login"

export default function Home() {
  const bgColor = useColorModeValue(
    "modes.light.background",
    "modes.dark.background",
  )
  const altBgColor = useColorModeValue(
    "modes.light.altBackground",
    "modes.dark.altBackground",
  )
  const logo = useColorModeValue(logoLight, logoDark)
  const hero = useColorModeValue(heroLight, heroDark)
  const { mutate: handleLogin } = useHandleLogin()

  return (
    <>
      <Container
        maxW="100%"
        bgImage={hero.src}
        sx={{ backgroundSize: "cover" }}
      >
        <Container maxW="4xl">
          <Box position="relative" py={8} px={4}>
            <Stack
              textAlign="center"
              align="center"
              spacing={{ base: 8, md: 10 }}
              py={10}
            >
              <Image height={50} width={50} src={logo} alt="Logo" />
              <Heading
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "3xl", md: "5xl" }}
                lineHeight="110%"
              >
                Decentralized Web Hosting for Humans
              </Heading>
              <Text maxW="3xl">
                Discover the seamless convergence of simplicity and Web3’s
                robust decentralization with GhostCloud. This platform is a
                gateway for &quot;2.0&quot; hosting entities to offer the
                groundbreaking benefits of decentralized hosting without the
                complexities of tokens or wallets. With GhostCloud, experience
                innovation and user-friendly accessibility, embracing the next
                era of web technology effortlessly.
              </Text>
              <Stack spacing={6} direction="row">
                <Button onClick={() => handleLogin()}>Get started</Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Container>

      <Container maxW="100%" bg={altBgColor}>
        <Container maxW="4xl">
          <Box py="80px" px={4}>
            <Flex align="center" justify="center" sx={{ mb: 12 }}>
              <Heading
                fontWeight={600}
                fontSize={{ base: "1xl", sm: "2xl", md: "3xl" }}
                lineHeight="110%"
                textAlign="center"
              >
                Simplicity Meets Decentralization
              </Heading>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <Feature
                icon={<Icon as={GoSmiley} w={10} h={10} />}
                title="Easy to use"
                text={
                  "GhostCloud provides a user-friendly interface, making Web3 accessible to everyone, regardless of their experience."
                }
              />
              <Feature
                icon={<Icon as={GoLock} w={10} h={10} />}
                title="Secure"
                text={
                  "GhostCloud leverages a decentralized server network, offering enhanced security compared to conventional hosting solutions."
                }
              />
              <Feature
                icon={<Icon as={GoShieldCheck} w={10} h={10} />}
                title="Uncompromising"
                text={
                  "GhostCloud stands resistant to censorship, ensuring your customers' data remains secure and unaltered."
                }
              />
            </SimpleGrid>
          </Box>
        </Container>
      </Container>

      <Container maxW="100%" bg={bgColor}>
        <Container maxW="4xl" pt={8}>
          <Box py={8} px={4}>
            <Flex align="center" justify="center">
              <Heading
                fontWeight={600}
                fontSize={{ base: "1xl", sm: "2xl", md: "3xl" }}
                lineHeight="110%"
              >
                Why GhostCloud?
              </Heading>
            </Flex>

            <Flex align="center" justify="center" p={6}>
              <Text maxW="3xl" align="center">
                Explore the fusion of the stable, steadily growing market of web
                hosting with the boundless potential of Web3 through GhostCloud.
                As the horizons of Web3 broaden, the quest for streamlined,
                efficient content delivery solutions is intensifying. GhostCloud
                distinguishes itself in this competitive landscape by
                specializing in seamless integrations with established hosting
                providers, transcending the confines of the nascent Web3 market.
                Opt for GhostCloud and be where innovation meets established
                market stability!
              </Text>
            </Flex>
          </Box>
        </Container>
      </Container>
    </>
  )
}
