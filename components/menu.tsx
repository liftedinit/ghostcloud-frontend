import {
  Button,
  Icon,
  Link as ChakraLink,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import useWeb3AuthStore from "../store/web3-auth";
import {TfiMenu} from "react-icons/tfi";
import Link from "next/link";
import useAuthHandlers from "../hooks/useAuthHandlers";
import React from "react";

type LoginProps = {}

const Menu: React.FC<LoginProps> = () => {
  const store = useWeb3AuthStore() // To access the provider
  const { handleLogin, handleLogout } = useAuthHandlers();

  return (
    <ChakraMenu>
      <MenuButton as={Button} px={0} variant="outline" justifySelf="end">
        <Icon as={TfiMenu}/>
      </MenuButton>
      <MenuList>
        {store.provider ? (
          <>
            <Link href="/dashboard" passHref>
              <ChakraLink>
                <MenuItem>Dashboard</MenuItem>
              </ChakraLink>
            </Link>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleLogin}>Login</MenuItem>
        )}
      </MenuList>
    </ChakraMenu>
  )
}

export default Menu