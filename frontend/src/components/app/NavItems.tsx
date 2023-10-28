import { Divider } from "@chakra-ui/react";
import { IMenuTab, INavItem } from "@src/data/interfaces";
import { FC, Fragment } from "react";
import NavItem from "./NavItem";

interface INavItemsProps {
  navItems: INavItem[];
  handleMenuClick: (tab: IMenuTab) => void;
  currentLabel: string;
}

const NavItems: FC<INavItemsProps> = ({
  navItems,
  currentLabel,
  handleMenuClick,
}) => {
  return (
    <Fragment>
      {navItems.map((item, index) => (
        <Fragment>
          {/* Divide Settings from rest of nav */}
          {item.menuTab.label === "Settings" && <Divider />}
          <NavItem
            onClick={handleMenuClick}
            isActive={item.menuTab.label === currentLabel}
            key={index}
            icon={item.icon}
            tab={item.menuTab}
          />
        </Fragment>
      ))}
    </Fragment>
  );
};

export default NavItems;
