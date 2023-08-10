import { IconType } from "react-icons";
import { IMenuTab } from "../interfaces";

export interface INavItemProps {
  isActive: boolean;
  icon: IconType;
  tab: IMenuTab;
  onClick: (tab: IMenuTab) => void;
}
