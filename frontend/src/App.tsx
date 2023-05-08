import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

import { FaClock, FaHome } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Home from "./pages/Home";

function App({ children }: { children: JSX.Element }) {
  const sidebar = useDisclosure();
  const color = useColorModeValue("gray.600", "gray.300");

  const [activeTab, setActiveTab] = useState("home");
  const [tabs, setTabs] = useState(["home"]);
  const [tabBody, setTabBody] = useState(<Home />);

  const closeTab = (tab: string) => {
    setTabs(tabs.filter((x) => x !== tab));
    handleMenuClick(tabs[tabs.length - 2]);
  };

  const handleMenuClick = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case "home":
        setTabBody(<Home />);
        break;
      case "wakatime":
        setTabBody(<>HI</>);
        break;
    }

    if (!tabs.includes(tab)) {
      tabs.push(tab);
    }
  };

  const NavItem = (props: any) => {
    const { icon, children, tab, ...rest } = props;

    return (
      <Flex
        onClick={() => handleMenuClick(tab)}
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{
          color: "gray.400",
        }}
        _hover={{
          bg: "gray.100",
          _dark: {
            bg: "gray.900",
          },
          color: "gray.900",
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

  const SidebarContent = (props: any) => (
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
      border
      color="inherit"
      borderRightWidth="1px"
      w="30"
      {...props}
    >
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
        <NavItem tab="home" icon={FaHome}>
          Home
        </NavItem>
        <NavItem tab="wakatime" icon={FaClock}>
          WakaTime
        </NavItem>
      </Flex>
    </Box>
  );

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent
        display={{
          base: "none",
          md: "unset",
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 40,
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          borderBottomWidth="1px"
          color="inherit"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{
              base: "inline-flex",
              md: "none",
            }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="white"
            _dark={{
              bg: "gray.800",
            }}
            borderBottomWidth="1px"
            color="inherit"
            h="14"
          >
            <IconButton
              aria-label="Menu"
              display={{
                base: "inline-flex",
                md: "none",
              }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
            <Box>
              <Flex align="center" h="full">
                {tabs.map((tab, index) => (
                  <Box
                    px="4"
                    py="2"
                    borderBottomWidth={activeTab === tab ? "2px" : "0px"}
                    borderBottomColor={
                      activeTab === tab ? "brand.500" : "transparent"
                    }
                    fontWeight={activeTab === tab ? "bold" : "normal"}
                    cursor="pointer"
                  >
                    <HStack>
                      <Text onClick={() => handleMenuClick(tab)}>{tab}</Text>
                      {tab !== "home" && (
                        <CloseButton
                          onClick={() => closeTab(tab)}
                          size={"sm"}
                          color={"red"}
                        />
                      )}
                    </HStack>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Flex>

        <Box as="main" p="4">
          <Box as="main" p="4">
            {tabBody}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
