import { data } from "@go/models";
import { atom } from "jotai";

export const remoteReposAtom = atom<data.RemoteRepo[]>([]);
