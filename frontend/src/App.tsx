import { Fragment, useEffect, useState } from "react";

import {
  FaCog,
  FaFolder,
  FaGithub,
  FaHome,
  FaNetworkWired,
} from "react-icons/fa";

import { IMenuTab, INavItem } from "@data/interfaces";
import { WindowSetTitle } from "@go-runtime/runtime";
import Git from "@pages/git/Git";
import Home from "@src/pages/home/Home";
import { useAtom } from "jotai";
import Directories from "./pages/directories/Directories";
import Settings from "./pages/settings/Settings";
import { openedTabsAtom, tabIndexAtom } from "./states/nav/TabsAtom";
import { GetAppState, GetSettings, SaveAppState } from "@go/main/App";
import { data } from "@go/models";
import ViewLocalRepo from "./pages/git/localRepo/ViewLocalRepo";
import { selectedAppModules } from "./states/nav/AppModulesAtom";
import Network from "./pages/Network/Network";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { XIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "./components/ui/sidebar";

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
  {
    icon: FaNetworkWired,
    menuTab: {
      label: "Network",
      body: <Network />,
      source: "nav",
    },
  },
];

function App() {
  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);
  const [openedTabs, setOpenedTabs] = useAtom(openedTabsAtom);
  const [appModules, setAppModules] = useAtom(selectedAppModules);
  const currentNav = appModules.map(
    (module) =>
      NAV_ITEMS.find(
        (item) =>
          item.menuTab.label === module || item.menuTab.label === "Settings",
      )!,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

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

    toggleDrawer();
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
    <div className="flex">
  <div className="flex">
    <Sidebar className="bg-white shadow-lg border-r">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">One-Dev</h2>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-2 p-2">
        {currentNav.map((nav, idx) => (
          <Fragment key={idx}>
            {nav.menuTab.label === "Settings" ? (
              <SidebarGroup className="mt-4 border-t pt-4">
                <div
                  onClick={() => handleMenuClick(nav.menuTab)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                >
                  {nav.icon && <nav.icon className="w-5 h-5 text-gray-600" />}
                  <p className="text-gray-700 font-medium">
                    {nav.menuTab.label}
                  </p>
                </div>
              </SidebarGroup>
            ) : (
              <div
                onClick={() => handleMenuClick(nav.menuTab)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
              >
                {nav.icon && <nav.icon className="w-5 h-5 text-gray-600" />}
                <p className="text-gray-700 font-medium">
                  {nav.menuTab.label}
                </p>
              </div>
            )}
          </Fragment>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <p className="text-sm text-gray-500">Built with ❤️</p>
      </SidebarFooter>
    </Sidebar>
    <SidebarTrigger className="self-start" />
  </div>
  <div className="flex-1">
    <Tabs
      key={tabIndex}
      tabIndex={tabIndex}
      defaultValue={openedTabs[tabIndex].label}
    >
      <TabsList>
        {openedTabs.map((tab) => (
          <div key={tab.label} className="flex items-center m-6">
            <TabsTrigger
              value={tab.label}
              className="bg-green-400"
            >
              {tab.label}
            </TabsTrigger>
            {tab.label !== "Home" && (
              <XIcon onClick={() => closeTab(tab)} color={"red"} />
            )}
          </div>
        ))}
      </TabsList>
      {openedTabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>{tab.body}</TabsContent>
      ))}
    </Tabs>
  </div>
</div>
  );
}

export default App;
