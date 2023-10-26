import { Box, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import LocalRepos from "./localRepo/LocalRepos";
import RemoteRepos from "./remoteRepo/RemoteRepos";

const Git = () => {
  const [totalLocal, setTotalLocal] = useState<number | undefined>();
  const [totalRemote, setTotalRemote] = useState<number | undefined>();
  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab>Local {totalLocal && `(${totalLocal})`} </Tab>
          <Tab>Remote {totalRemote && `(${totalRemote})`} </Tab>
        </TabList>

        <TabPanels>
          <LocalRepos updateCount={setTotalLocal} />
          <RemoteRepos updateCount={setTotalRemote} />
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Git;
