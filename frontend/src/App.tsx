import {
  Box,
  CloseButton,
  Divider,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";

import { FaCog, FaGithub, FaHome } from "react-icons/fa";

import NavItem from "@components/app/NavItem";
import SidebarContent from "@components/app/SidebarContent";
import { IMenuTab, INavItem } from "@data/interfaces";
import { WindowSetTitle } from "@go-runtime/runtime";
import Git from "@pages/git/Git";
import Home from "@src/pages/home/Home";
import Settings from "./pages/settings/settings";

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
  {
    icon: FaCog,
    menuTab: {
      label: "Settings",
      body: <Settings />,
    },
  },
];

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const [openedTabs, setOpenedTabs] = useState<IMenuTab[]>([
    NAV_ITEMS[0].menuTab,
  ]);

  const setWindowTitle = (window: string) => {
    WindowSetTitle(`One Dev | ${window}`);
  };

  const closeTab = (tab: IMenuTab) => {
    setOpenedTabs(openedTabs.filter((x) => x !== tab));
    const nextTabIndex = openedTabs.length - 2;
    setTabIndex(nextTabIndex);
    setWindowTitle(openedTabs[nextTabIndex].label);
  };

  const handleMenuClick = (tab: IMenuTab) => {
    const isTabOpened = openedTabs.find((x) => x.label === tab.label);
    setWindowTitle(tab.label);

    if (!isTabOpened) {
      const newOpenedTabs = [...openedTabs, tab];
      setOpenedTabs([...newOpenedTabs]);
      setTabIndex(newOpenedTabs.findIndex((x) => x.label === tab.label));
    } else {
      setTabIndex(openedTabs.findIndex((x) => x.label === tab.label));
    }
  };

  useEffect(() => {
    setWindowTitle("Home");
  }, []);

  const navItems = NAV_ITEMS.map((item, index) => (
    <Fragment>
      {/* Divide Settings from rest of nav */}
      {item.menuTab.label === "Settings" && <Divider />}
      <NavItem
        onClick={handleMenuClick}
        isActive={item.menuTab.label === openedTabs[tabIndex].label}
        key={index}
        icon={item.icon}
        tab={item.menuTab}
      />
    </Fragment>
  ));

  const tabPanels = openedTabs.map((tabBody, index) => (
    <TabPanel key={index}>{tabBody.body}</TabPanel>
  ));

  const tabList = openedTabs.map((tab, index) => (
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
        {tabIndex}
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <TabList>{tabList}</TabList>

          <TabPanels>{tabPanels}</TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default App;
