import {
  Button,
  Icon,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import useWeb3AuthStore from "../store/web3-auth"
import { TfiMenu } from "react-icons/tfi"
import Link from "next/link"
import React from "react"
import useHandlePayment from "../hooks/payment/handle-payment"
import { useHandleLogin } from "../hooks/auth/handle-login"
import { useHandleLogout } from "../hooks/auth/handle-logout"

type LoginProps = {}

const Menu: React.FC<LoginProps> = () => {
  const store = useWeb3AuthStore() // To access the provider
  const { mutate: handleLogin } = useHandleLogin()
  const { mutate: handleLogout } = useHandleLogout()
  const { handlePayment } = useHandlePayment()

  return (
    <ChakraMenu>
      <MenuButton
        as={Button}
        px={0}
        variant="outline"
        justifySelf="end"
        data-testid="menu"
      >
        <Icon as={TfiMenu} />
      </MenuButton>
      <MenuList>
        {store.provider ? (
          <>
            <MenuItem onClick={handlePayment}>Buy Tokens</MenuItem>
            <Link href="/dashboard" passHref>
              <MenuItem>Dashboard</MenuItem>
            </Link>
            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => handleLogin()}>Login</MenuItem>
        )}
      </MenuList>
    </ChakraMenu>
  )
}

export default Menu
