import {
  Center,
  Grid,
  GridItem,
  Spinner,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";
import { GetRemoteRepos } from "@go/main/App";
import { data } from "@go/models";
import { enqueueSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import ViewRemoteRepoModal from "./ViewRemoteRepo";

const RemoteRepos = () => {
  const [repos, setRepos] = useState<data.RemoteRepo[]>();
  const [activeRepo, setActiveRepo] = useState<data.RemoteRepo>();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    GetRemoteRepos()
      .then((repos) => {
        setRepos(repos);
        setIsLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRepoView = (repo: data.RemoteRepo) => {
    setActiveRepo(repo);
    onOpen();
  };

  if (isLoading) {
    return (
      <TabPanel>
        <Center>
          <Spinner />
        </Center>
      </TabPanel>
    );
  }

  const repoGridItem = repos?.map((repo) => (
    <GridItem
      key={repo.id}
      onClick={() => handleRepoView(repo)}
      w="100%"
      h="100%"
      p={5}
      bg="blue.500"
    >
      <p>
        {repo.name}
        {repo.private ? " (private)" : "(public)"}
      </p>
    </GridItem>
  ));

  return (
    <TabPanel>
      <Grid
        maxH={500}
        templateColumns="repeat(5, 1fr)"
        overflowY={"scroll"}
        gap={6}
      >
        {repos && (
          <Fragment>
            <ViewRemoteRepoModal
              isOpen={isOpen}
              onClose={onClose}
              repo={activeRepo!}
            />
            {repoGridItem}
          </Fragment>
        )}
      </Grid>
    </TabPanel>
  );
};

export default RemoteRepos;
