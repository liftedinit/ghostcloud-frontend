import React from 'react';
import Image from 'next/image';
import {
  Button,
  Container,
  Grid,
  GridItem,
  Icon,
  Link as ChakraLink,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import Link from 'next/link';
import logoLight from '../public/logo-black.png';
import logoDark from '../public/logo-white.png';
import {BsFillMoonStarsFill, BsFillSunFill} from "react-icons/bs";

function Header() {
  const {colorMode, toggleColorMode} = useColorMode()
  const bgColor = useColorModeValue('modes.light.background', 'modes.dark.background')
  const logo = useColorModeValue(logoLight, logoDark);

  return (
    <header>
      <Container
        maxWidth="100%"
        borderBottom='1px solid'
        data-testid="header"
        bg={bgColor}
      >
        <Container maxW="4xl">
          <Grid templateColumns={`repeat(3, 1fr)`}>
            <GridItem
              colSpan={1}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'flex-start'}
              py={2}
            >
            </GridItem>
            <GridItem
              colSpan={1}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              py={2}
            >
              <Link href="/" passHref>
                <ChakraLink p={2}>
                  <Image src={logo} alt="Header Logo" height={16} width={206}/>
                </ChakraLink>
              </Link>
            </GridItem>
            <GridItem
              colSpan={1}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'flex-end'}
              py={2}
            >
              <Button variant="outline" px={0} onClick={toggleColorMode} justifySelf="end">
                <Icon as={colorMode === 'light' ? BsFillMoonStarsFill : BsFillSunFill}/>
              </Button>
            </GridItem>
          </Grid>
        </Container>
      </Container>
    </header>
  );
}

export default Header;