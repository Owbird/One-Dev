import {
  Box,
  Flex,
  HStack,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Drawer from "react-modern-drawer";
import { FaMoon, FaSun } from "react-icons/fa";
import "react-modern-drawer/dist/index.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { ReactNode, useState } from "react";

interface ISidebarContentProps {
  children: ReactNode;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const SidebarContent = ({
  children,
  isDrawerOpen,
  toggleDrawer,
}: ISidebarContentProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Box ml={4}>
        <GiHamburgerMenu size={30} onClick={toggleDrawer} />
      </Box>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="left">
        <Box
          as="nav"
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
      </Drawer>
    </Box>
  );
};

export default SidebarContent;
