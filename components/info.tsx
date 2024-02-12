import { Box, Icon, Tooltip, useTheme } from "@chakra-ui/react"
import { FaInfoCircle } from "react-icons/fa"
import {
  GHOSTCLOUD_INFRA_LOADBALANCER_IP
} from "../config/ghostcloud-infra"

export const tips = {
  name: "The randomly generated identifier for your deployment.",
  description:
    "A description for your deployment. This must be between 1-500 characters in length.",
  domain: `The domain where your site will be hosted. Set your domain's DNS A record to ${GHOSTCLOUD_INFRA_LOADBALANCER_IP} to activate custom domain.`,
  memo: "A string associated with a transaction in Web3",
  file: "Select a zip file less that 5MB in size which contains your site build. This archive must contain an index.html file in the root.",
}

type TipKeys = keyof typeof tips

type InfoProps = {
  id: TipKeys
}

export default function Info({ id }: InfoProps) {
  const theme = useTheme()

  return (
    <Tooltip label={tips[id]}>
      <Box as="span">
        <Icon
          data-testid={`info-${id}`}
          as={FaInfoCircle}
          boxSize={4}
          color={theme.colors.gray[400]}
        />
      </Box>
    </Tooltip>
  )
}
