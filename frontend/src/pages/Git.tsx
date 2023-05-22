import { Box, Grid, GridItem, Input } from "@chakra-ui/react";
import { GetGitDirs } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";

const Git = () => {
  const [dirs, setDirs] = useState<data.File[]>([]);
  const [searchRes, setSearchRes] = useState<data.File[]>();
  const [searchQuery, setSearchQuery] = useState("");

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
            <GridItem w="100%" h="100%" p={5} bg="blue.500">
              <p>{dir.dir}</p>
            </GridItem>
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default Git;
