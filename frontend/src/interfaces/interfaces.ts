import { IconType } from "react-icons";

export interface IMenuTab {
  label: string;
  body: JSX.Element;
}

export interface INavItem {
  icon: IconType;
  menuTab: IMenuTab;
}
