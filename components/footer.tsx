import React from "react"
import Image from "next/image"
import {
  Box,
  Container,
  Link as ChakraLink,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Link from "next/link"
import logoDark from "@/public/logo-white.png"
import logoLight from "@/public/logo-black.png"
import manifest from "@/public/manifest-powered.webp"

export default function Footer() {
  const bgColor = useColorModeValue(
    "modes.dark.background",
    "modes.light.background",
  )
  const textColor = useColorModeValue("modes.dark.text", "modes.light.text")
  const logo = useColorModeValue(logoDark, logoLight)

  return (
    <Box bg={bgColor} color={textColor}>
      <Container
        as={Stack}
        maxW="4xl"
        pt={20}
        spacing={4}
        justify="center"
        align="center"
      >
        <Image height={16} width={206} src={logo} alt="Logo" />
        <Stack
          direction="row"
          spacing={6}
          wrap="wrap"
          justify="center"
          lineHeight={2.5}
        >
          <Link href="/" passHref>
            Home
          </Link>
          <Link href="/terms" passHref>
            Terms Of Service
          </Link>
          <Link href="/privacy" passHref>
            Privacy Policy
          </Link>
          <Link
            href="https://discord.gg/ufcVz3NsEz"
            passHref
            rel="noopener noreferrer"
            target="_blank"
          >
            Discord
          </Link>
        </Stack>
      </Container>

      <Container
        as={Stack}
        maxW="4xl"
        pt={10}
        pb={10}
        spacing={4}
        justify="center"
        align="center"
      >
        <Text>
          &copy; {new Date().getUTCFullYear()} GhostCloud. All rights reserved
        </Text>
      </Container>

      <Container
        as={Stack}
        maxW="4xl"
        pb={20}
        spacing={4}
        justify="center"
        align="center"
      >
        <ChakraLink href="https://www.liftedinit.org/#/hosting" isExternal>
          <Image
            height={59}
            width={200}
            src={manifest}
            alt="Powered by Manifest Logo"
          />
        </ChakraLink>
      </Container>
    </Box>
  )
}
