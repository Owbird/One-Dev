import { TabPanel, TabPanels } from "@chakra-ui/react";
import { IMenuTab } from "@src/data/interfaces";
import { FC } from "react";

interface INavTabPanels {
  panels: IMenuTab[];
}

const NavTabPanels: FC<INavTabPanels> = ({ panels }) => {
  return (
    <TabPanels>
      {panels.map((tab, index) => (
        <TabPanel key={index}>{tab.body}</TabPanel>
      ))}
    </TabPanels>
  );
};

export default NavTabPanels;
