import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';
import '@interchain-ui/react/styles';
import Header from "../components/header";
import Footer from "../components/footer";

function CreateCosmosApp({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={defaultTheme}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
