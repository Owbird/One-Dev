import { IMenuTab } from "@src/data/interfaces";
import { atom } from "jotai";

export const openedTabsAtom = atom<IMenuTab[]>([]);
export const tabIndexAtom = atom(0);
