import { IconType } from "react-icons";

export interface IMenuTab {
  label: string;
  body: JSX.Element;
  source: "nav" | "git"
  meta?: Record<string, any>
}

export interface INavItem {
  icon: IconType;
  menuTab: IMenuTab;
}
