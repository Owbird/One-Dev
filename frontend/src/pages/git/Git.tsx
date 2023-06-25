import { Box, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import LocalRepos from "./localRepo/LocalRepos";
import RemoteRepos from "./remoteRepo/RemoteRepos";

const Git = () => {
  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab>Local </Tab>
          <Tab>Remote </Tab>
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
