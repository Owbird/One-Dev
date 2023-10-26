import { Grid, GridItem, TabPanel, useDisclosure } from "@chakra-ui/react";
import { GetRemoteRepos } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { enqueueSnackbar } from "notistack";
import { FC, Fragment, useEffect, useState } from "react";
import ViewRemoteRepoModal from "./ViewRemoteRepo";

interface RemoteReposProps {
  updateCount: (value: number) => void;
}

const RemoteRepos: FC<RemoteReposProps> = ({ updateCount }) => {
  const [repos, setRepos] = useState<data.RemoteRepo[]>();
  const [activeRepo, setActiveRepo] = useState<data.RemoteRepo>();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    GetRemoteRepos()
      .then((repos) => {
        setRepos(repos);
        updateCount(repos.length);
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
        <Loader />
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
