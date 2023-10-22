import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import FileSystems from "@src/components/home/FileSystems";
import Greeting from "@src/components/home/Greeting";
import Processess from "@src/components/home/Processess";
import Resources from "@src/components/home/Resources";
import { Fragment } from "react";

const Home = () => {
  return (
    <Fragment>
      <Greeting />
      <VStack alignItems={"flex-start"}>
        <Tabs>
          <TabList>
            <Tab>Resources</Tab>
            <Tab>Processes</Tab>
            <Tab>File Systems</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Resources />
            </TabPanel>
            <TabPanel>
              <Processess />
            </TabPanel>
            <TabPanel>
              <FileSystems />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Fragment>
  );
};

export default Home;
