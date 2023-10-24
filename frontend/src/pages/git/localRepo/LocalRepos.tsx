import { Divider, Grid, GridItem, Input, TabPanel } from "@chakra-ui/react";
import { GetGitDirs } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { GitRoutes } from "@src/data/constants/routes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LocalRepos = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [dirs, setDirs] = useState<data.File[]>([]);
  const [searchRes, setSearchRes] = useState<data.File[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    GetGitDirs().then((dirs) => {
      setDirs(dirs);
      setIsLoading(false);
    });
  }, []);
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
        <Loader />
      </TabPanel>
    );
  }

  const repoGridItem = (searchRes ?? dirs).map((dir) => (
    <GridItem
      key={dir.parentDir}
      onClick={() =>
        navigate(`${GitRoutes.LocalRepoView}?dir=${dir.parentDir}`)
      }
      w="100%"
      h="100%"
      p={5}
      bg="blue.500"
    >
      <p>{dir.dir}</p>
    </GridItem>
  ));
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
        {repoGridItem}
      </Grid>
    </TabPanel>
  );
};

export default LocalRepos;
