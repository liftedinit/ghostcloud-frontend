import { useToast } from "@chakra-ui/react"

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
