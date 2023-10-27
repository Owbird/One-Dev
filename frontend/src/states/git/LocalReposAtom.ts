import { data } from "@go/models";
import { atom } from "jotai";

export const localReposAtom = atom<data.File[]>([]);
