import { Box, Tabs } from "@chakra-ui/react";
import { Fragment, useEffect } from "react";

import { FaCog, FaFolder, FaGithub, FaHome } from "react-icons/fa";

import SidebarContent from "@components/app/SidebarContent";
import { IMenuTab, INavItem } from "@data/interfaces";
import { WindowSetTitle } from "@go-runtime/runtime";
import Git from "@pages/git/Git";
import Home from "@src/pages/home/Home";
import { useAtom, useAtomValue } from "jotai";
import NavItems from "./components/app/NavItems";
import NavTabList from "./components/app/NavTabList";
import NavTabPanels from "./components/app/NavTabPanels";
import Directories from "./pages/directories/Directories";
import Settings from "./pages/settings/Settings";
import { openedTabsAtom, tabIndexAtom } from "./states/nav/TabsAtom";
import { GetAppState, GetSettings, SaveAppState } from "@go/main/App";
import { data } from "@go/models";
import ViewLocalRepo from "./pages/git/localRepo/ViewLocalRepo";
import { selectedAppModules } from "./states/nav/AppModulesAtom";

const NAV_ITEMS: INavItem[] = [
  {
    icon: FaHome,
    menuTab: {
      label: "Home",
      body: <Home />,
      source: "nav",
    },
  },
  {
    icon: FaGithub,
    menuTab: {
      label: "Git & Github",
      body: <Git />,
      source: "nav",
    },
  },
  {
    icon: FaFolder,
    menuTab: {
      label: "Directories",
      body: <Directories />,
      source: "nav",
    },
  },
  {
    icon: FaCog,
    menuTab: {
      label: "Settings",
      body: <Settings />,
      source: "nav",
    },
  },
];

function App() {
  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);
  const [openedTabs, setOpenedTabs] = useAtom(openedTabsAtom);
  const [appModules, setAppModules] = useAtom(selectedAppModules);
  const currentNav = appModules.map(
    (module) => NAV_ITEMS.find((item) => item.menuTab.label === module)!,
  );

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
    GetSettings().then((settings) => {
      setAppModules((prev) => [
        prev[0],
        ...settings.modules,
        prev[prev.length - 1],
      ]);
    });

    GetAppState().then((state) => {
      const tabs: IMenuTab[] = [];

      for (let tab of state.openedTabs) {
        const source = tab.source as IMenuTab["source"];

        switch (source) {
          case "nav":
            tabs.push(
              NAV_ITEMS.find((nav) => nav.menuTab.label === tab.label)
                ?.menuTab!,
            );

            break;

          case "git":
            tabs.push({
              source,
              label: tab.label,
              meta: tab.meta,
              body: (
                <ViewLocalRepo
                  key={tab.meta.parentDir}
                  repo={tab.meta.parentDir}
                />
              ),
            });

            break;

          default:
            break;
        }
      }

      setOpenedTabs(tabs);

      setTabIndex(state.activeIndex);

      setWindowTitle(tabs[state.activeIndex].label);
    });
  }, []);

  useEffect(() => {
    if (openedTabs.length !== 0) {
      const state = {
        activeIndex: tabIndex,
        openedTabs: openedTabs.map((tab) => ({
          label: tab.label,
          source: tab.source,
          meta: tab.meta,
        })),
      } as data.AppState;

      SaveAppState(state);
    }
  }, [tabIndex, openedTabs]);

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
          navItems={currentNav}
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
