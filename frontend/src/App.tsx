import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { FaGithub, FaHome, FaMoon, FaSun } from "react-icons/fa";

import { EventsOn } from "@go-runtime/runtime";
import Home from "@pages/Home";
import { IconType } from "react-icons";
import { IMenuTab, INavItem } from "./interfaces/interfaces";
import Git from "./pages/git/Git";

const NAV_ITEMS: INavItem[] = [
  {
    icon: FaHome,
    menuTab: {
      label: "Home",
      body: <Home />,
    },
  },
  {
    icon: FaGithub,
    menuTab: {
      label: "Git",
      body: <Git />,
    },
  },
];

function App() {
  const sidebar = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue("gray.600", "gray.300");

  const [error, setError] = useState();

  const [tabIndex, setTabIndex] = useState(0);

  const [tabs, setTabs] = useState<IMenuTab[]>([NAV_ITEMS[0].menuTab]);

  const closeTab = (tab: IMenuTab) => {
    setTabs(tabs.filter((x) => x !== tab));
    setTabIndex(tabs.length - 2);
  };

  const handleMenuClick = (tab: IMenuTab) => {
    if (!tabs.find((x) => tab.label === x.label)) {
      setTabs([...tabs, tab]);
      setTabIndex(tabs.length);
    } else {
      setTabIndex(tabs.findIndex((x) => x.label === tab.label));
    }
  };

  useEffect(() => {
    EventsOn("error", setError);
  }, []);

  const NavItem = ({
    isActive,
    icon,
    tab,
  }: {
    isActive: boolean;
    icon: IconType;
    tab: IMenuTab;
  }) => {
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
        bg={isActive ? "blue.100" : "transparent"}
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
        {tab.label}
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
            {NAV_ITEMS.map((item, index) => (
              <NavItem
                isActive={index === tabIndex}
                key={index}
                icon={item.icon}
                tab={{
                  label: item.menuTab.label,
                  body: item.menuTab.body,
                }}
              />
            ))}
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
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <TabList>
            {tabs.map((tab, index) => (
              <HStack>
                <Tab key={index}>{tab.label}</Tab>
                {tab.label !== "Home" && (
                  <CloseButton
                    onClick={() => closeTab(tab)}
                    size={"sm"}
                    color={"red"}
                  />
                )}
              </HStack>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tabBody, index) => (
              <TabPanel key={index}>{tabBody.body}</TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default App;
