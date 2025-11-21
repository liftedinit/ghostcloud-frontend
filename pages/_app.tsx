import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { defaultTheme } from "../config"
import "@interchain-ui/react/styles"
import Header from "../components/header"
import Footer from "../components/footer"
import LoginWrapper from "../components/login-wrapper"
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query"
import { useDisplayError } from "../helpers/errors"
import { useMemo } from "react"

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const displayError = useDisplayError()

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta && typeof query.meta.errorMessage === "string") {
              displayError(query.meta.errorMessage, error)
            } else {
              // Provide a default message
              displayError("Query Error", error)
            }
          },
        }),
      }),
    [displayError],
  )

  return (
    <LoginWrapper>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={defaultTheme}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ChakraProvider>
      </QueryClientProvider>
    </LoginWrapper>
  )
}

export default CreateCosmosApp
