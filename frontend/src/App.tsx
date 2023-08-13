import {
  Box,
  CloseButton,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { FaGithub, FaHome } from "react-icons/fa";

import NavItem from "@components/app/NavItem";
import SidebarContent from "@components/app/SidebarContent";
import { IMenuTab, INavItem } from "@data/interfaces";
import { WindowSetTitle } from "@go-runtime/runtime";
import Home from "@pages/Home";
import Git from "@pages/git/Git";

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
  const [tabIndex, setTabIndex] = useState(0);

  const [tabs, setTabs] = useState<IMenuTab[]>([NAV_ITEMS[0].menuTab]);

  const setWindowTitle = (window: string) => {
    WindowSetTitle(`One Dev | ${window}`);
  };

  const closeTab = (tab: IMenuTab) => {
    setTabs(tabs.filter((x) => x !== tab));
    const nextTabIndex = tabs.length - 2;
    setTabIndex(nextTabIndex);
    setWindowTitle(tabs[nextTabIndex].label);
  };

  const handleMenuClick = (tab: IMenuTab) => {
    if (!tabs.find((x) => tab.label === x.label)) {
      setTabs([...tabs, tab]);
      setTabIndex(tabs.length);
    } else {
      setTabIndex(tabs.findIndex((x) => x.label === tab.label));
    }
    setWindowTitle(tab.label);
  };

  useEffect(() => {
    setWindowTitle("Home");
  }, []);

  const navItems = NAV_ITEMS.map((item, index) => (
    <NavItem
      onClick={handleMenuClick}
      isActive={index === tabIndex}
      key={index}
      icon={item.icon}
      tab={{
        label: item.menuTab.label,
        body: item.menuTab.body,
      }}
    />
  ));

  const tabPanels = tabs.map((tabBody, index) => (
    <TabPanel key={index}>{tabBody.body}</TabPanel>
  ));

  const tabList = tabs.map((tab, index) => (
    <HStack key={index}>
      <Tab key={index}>{tab.label}</Tab>
      {tab.label !== "Home" && (
        <CloseButton onClick={() => closeTab(tab)} size={"sm"} color={"red"} />
      )}
    </HStack>
  ));

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent>{navItems}</SidebarContent>

      <Box
        ml={{
          base: 0,
          md: 40,
        }}
        transition=".3s ease"
      >
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <TabList>{tabList}</TabList>

          <TabPanels>{tabPanels}</TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default App;
