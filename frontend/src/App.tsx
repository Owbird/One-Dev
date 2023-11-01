import { Box, Tabs } from "@chakra-ui/react";
import { Fragment, useEffect } from "react";

import { FaCog, FaFolder, FaGithub, FaHome } from "react-icons/fa";

import SidebarContent from "@components/app/SidebarContent";
import { IMenuTab, INavItem } from "@data/interfaces";
import { WindowSetTitle } from "@go-runtime/runtime";
import Git from "@pages/git/Git";
import Home from "@src/pages/home/Home";
import { useAtom } from "jotai";
import NavItems from "./components/app/NavItems";
import NavTabList from "./components/app/NavTabList";
import NavTabPanels from "./components/app/NavTabPanels";
import Directories from "./pages/Directories/Directories";
import Settings from "./pages/settings/Settings";
import { openedTabsAtom, tabIndexAtom } from "./states/nav/TabsAtom";

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
      label: "Git & Github",
      body: <Git />,
    },
  },
  {
    icon: FaFolder,
    menuTab: {
      label: "Directories",
      body: <Directories />,
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
  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);
  const [openedTabs, setOpenedTabs] = useAtom(openedTabsAtom);

  const setWindowTitle = (window: string) => {
    WindowSetTitle(`One Dev | ${window}`);
  };

  const closeTab = (tab: IMenuTab) => {
    const currentIndex = openedTabs.findIndex((x) => x === tab);
    const nextTabIndex = currentIndex - 1;

    const newTabs = openedTabs.filter((x) => x.label !== tab.label);

    setOpenedTabs(newTabs);

    setTabIndex(nextTabIndex);

    setWindowTitle(newTabs[nextTabIndex].label);
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
    setOpenedTabs([NAV_ITEMS[0].menuTab]);
  }, []);

  if (openedTabs.length === 0) {
    return <Fragment></Fragment>;
  }

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent>
        <NavItems
          handleMenuClick={handleMenuClick}
          currentLabel={openedTabs[tabIndex].label}
          navItems={NAV_ITEMS}
        />
      </SidebarContent>
      <Box
        ml={{
          base: 0,
          md: 40,
        }}
        transition=".3s ease"
      >
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <NavTabList
            tabs={openedTabs}
            onTabClick={setWindowTitle}
            closeTab={closeTab}
          />

          <NavTabPanels panels={openedTabs} />
        </Tabs>
      </Box>
    </Box>
  );
}

export default App;
