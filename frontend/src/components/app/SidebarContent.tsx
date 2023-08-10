import {
  Box,
  Flex,
  HStack,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: "gray.800",
      }}
      color="inherit"
      borderRightWidth="1px"
      w="30"
      display={{
        base: "none",
        md: "unset",
      }}
      borderRight="none"
    >
      <Flex direction="column" h="full" justify="space-between">
        <div>
          <Flex px="4" py="5" align="center">
            <Text
              fontSize="2xl"
              ml="2"
              color="brand.500"
              _dark={{
                color: "white",
              }}
              fontWeight="semibold"
            >
              One Dev
            </Text>
          </Flex>
          <Flex
            direction="column"
            as="nav"
            fontSize="sm"
            color="gray.600"
            aria-label="Main Navigation"
          >
            {children}
          </Flex>
        </div>
        <Flex align="center" justify="center" py="4">
          <HStack>
            {colorMode === "dark" ? <FaMoon /> : <FaSun />}
            <Switch
              onChange={toggleColorMode}
              isChecked={colorMode === "dark"}
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SidebarContent;
