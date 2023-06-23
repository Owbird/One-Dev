import { Box, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import LocalRepos from "./LocalRepos";
import RemoteRepos from "./RemoteRepos";

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
