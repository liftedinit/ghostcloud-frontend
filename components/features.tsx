import {
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FeatureProps } from './types';
import React from "react";

export const Feature = ({title, text, icon}: FeatureProps) => {
  const bgColor = useColorModeValue('modes.light.background', 'modes.dark.background');
  const textColor = useColorModeValue('modes.light.text', 'modes.dark.text');

  return (
    <Stack>
      <Flex align="center" justify="center">
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          color={textColor}
          rounded="full"
          bg={bgColor}
          mb={1}
        >
          {icon}
        </Flex>
      </Flex>

      <Flex align="center" justify="center">
        <Heading
          fontSize={{base: '1xl', sm: '1xl', md: '2xl'}}
          sx={{textAlign: 'center'}}
        >
          {title}
        </Heading>
      </Flex>
      <Flex align="center" justify="center">
        <Text align="center">{text}</Text>
      </Flex>
    </Stack>
  )
}
