import {
  Box,
  Divider,
  Grid,
  GridItem,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { GetGitDirs } from "@go/main/App";
import { data } from "@go/models";
import ActiveRepo from "@src/pages/git/ActiveRepo";
import { Fragment, useEffect, useState } from "react";

const Git = () => {
  const [dirs, setDirs] = useState<data.File[]>([]);
  const [searchRes, setSearchRes] = useState<data.File[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDir, setActiveRepo] = useState<data.File>();

  const clearActiveDir = () => {
    setActiveRepo(undefined);
  };

  useEffect(() => {
    GetGitDirs().then(setDirs);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === "") {
      setSearchRes(undefined);
    } else {
      setSearchRes(
        dirs.filter((dir) =>
          dir.dir.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  return (
    <Box>
      {!activeDir ? (
        <Tabs>
          <TabList>
            <Tab>Local</Tab>
            <Tab>Remote</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Divider width={20} />
              <br />
              <Input
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                mb={4}
                placeholder={"Search..."}
              />
              <Grid
                maxH={500}
                overflowY={"scroll"}
                templateColumns="repeat(5, 1fr)"
                gap={6}
              >
                {(searchRes ?? dirs).map((dir) => (
                  <Fragment>
                    <GridItem
                      onClick={() => setActiveRepo(dir)}
                      w="100%"
                      h="100%"
                      p={5}
                      bg="blue.500"
                    >
                      <p>{dir.dir}</p>
                    </GridItem>
                  </Fragment>
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <ActiveRepo repo={activeDir} clear={clearActiveDir} />
      )}
    </Box>
  );
};

export default Git;
