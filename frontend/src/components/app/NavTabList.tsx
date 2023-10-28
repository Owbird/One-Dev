import { CloseButton, HStack, Tab, TabList } from "@chakra-ui/react";
import { IMenuTab } from "@src/data/interfaces";
import { FC } from "react";

interface INavTabList {
  tabs: IMenuTab[];
  onTabClick: (label: string) => void;
  closeTab: (tab: IMenuTab) => void;
}

const NavTabList: FC<INavTabList> = ({ tabs, onTabClick, closeTab }) => {
  return (
    <TabList>
      {tabs.map((tab, index) => (
        <HStack key={index}>
          <Tab onClick={() => onTabClick(tab.label)} key={index}>
            {tab.label}
          </Tab>
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
  );
};

export default NavTabList;
