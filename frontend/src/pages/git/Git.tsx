import { Box, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { localReposAtom } from "@src/states/git/LocalReposAtom";
import { remoteReposAtom } from "@src/states/git/RemoteReposAtom";
import { useAtomValue } from "jotai";
import LocalRepos from "./localRepo/LocalRepos";
import RemoteRepos from "./remoteRepo/RemoteRepos";

const Git = () => {
  const totalLocal = useAtomValue(localReposAtom);
  const totalRemote = useAtomValue(remoteReposAtom);
  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab>
            Local {totalLocal.length !== 0 && `(${totalLocal.length})`}{" "}
          </Tab>
          <Tab>
            Remote {totalRemote.length !== 0 && `(${totalRemote.length})`}{" "}
          </Tab>
        </TabList>

        <TabPanels>
          <LocalRepos />
          <RemoteRepos />
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Git;
