import {
  Center,
  Divider,
  Grid,
  GridItem,
  Input,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { GetGitDirs, GetIndexedRepos } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { localReposAtom } from "@src/states/git/LocalReposAtom";
import { openedTabsAtom, tabIndexAtom } from "@src/states/nav/TabsAtom";
import { useAtom, useSetAtom } from "jotai";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import ViewLocalRepo from "./ViewLocalRepo";

const LocalRepos = () => {
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [openedTabs, setOpenedTabs] = useAtom(openedTabsAtom);
  const [dirs, setDirs] = useAtom(localReposAtom);
  const [isLoading, setIsLoading] = useState(dirs.length === 0);
  const [searchRes, setSearchRes] = useState<data.File[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const setTabIndex = useSetAtom(tabIndexAtom);

  useEffect(() => {
    GetIndexedRepos().then((dirs) => {
      setDirs(dirs);
      setIsLoading(false);
    });
  }, []);

  // Update index in background
  useEffect(() => {
    GetGitDirs().then((dirs) => {
      setDirs(dirs);
      enqueueSnackbar("Local repos index updated", {
        variant: "success",
      });
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isLoading) {
        setIsTakingLong(true);
      }
    }, 15000);
  }, []);

  const viewRepo = (repo: data.File) => {
    const alreadyOpenedIndex = openedTabs.findIndex(
      (x) => x.label === repo.dir,
    );

    if (alreadyOpenedIndex === -1) {
      setOpenedTabs([
        ...openedTabs,
        {
          body: <ViewLocalRepo key={repo.parentDir} repo={repo.parentDir} />,
          label: repo.dir,
          source: "git",
          meta: repo
        },
      ]);
      setTabIndex(openedTabs.length);
    } else {
      setTabIndex(alreadyOpenedIndex);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === "") {
      setSearchRes(undefined);
    } else {
      setSearchRes(
        dirs.filter((dir) =>
          dir.dir.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  };

  if (isLoading) {
    return (
      <TabPanel>
        <Center>
          <Loader />
          {isTakingLong && <Text>This is taking longer than expected!</Text>}
        </Center>
      </TabPanel>
    );
  }

  return (
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
          <GridItem
            borderRadius={"10px"}
            key={dir.parentDir}
            onClick={() => {
              viewRepo(dir);
            }}
            w="100%"
            h="100%"
            p={5}
            bg="blue.500"
          >
            <p>{dir.dir}</p>
          </GridItem>
        ))}
      </Grid>
    </TabPanel>
  );
};

export default LocalRepos;
