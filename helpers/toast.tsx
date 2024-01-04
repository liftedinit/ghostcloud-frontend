import { useToast } from "@chakra-ui/react"
import { ReactNode } from "react"

export function useDisplaySuccess() {
  const toast = useToast()

  return (title: string, msg: ReactNode) => {
    toast({
      title,
      description: msg,
      status: "success",
      duration: 10000,
      isClosable: true,
      position: "top",
      containerStyle: {
        width: "850px",
        maxWidth: "100%",
      },
    })
  }
}

export function useDisplayError() {
  const toast = useToast()

  return (title: string, error: Error) => {
    toast({
      title,
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    })
  }
}
