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
import useAuthHandlers from "../hooks/useAuthHandlers"
import React from "react"

type LoginProps = {}

const Menu: React.FC<LoginProps> = () => {
  const store = useWeb3AuthStore() // To access the provider
  const { handleLogin, handleLogout } = useAuthHandlers()

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
            <Link href="/dashboard" passHref>
              <MenuItem>Dashboard</MenuItem>
            </Link>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={ev => handleLogin(ev, true)}>Login</MenuItem>
        )}
      </MenuList>
    </ChakraMenu>
  )
}

export default Menu
