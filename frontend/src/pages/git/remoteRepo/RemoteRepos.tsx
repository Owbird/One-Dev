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
import { Fragment, useEffect, useState } from "react";
import ViewRemoteRepoModal from "./ViewRemoteRepo";

const RemoteRepos = () => {
  const [repos, setRepos] = useState<data.RemoteRepos>();
  const [activeRepo, setActiveRepo] = useState<data.RemoteRepoItem>();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    GetRemoteRepos().then((repos) => {
      setRepos(repos);
      setIsLoading(false);
    });
  }, []);

  const handleRepoView = (repo: data.RemoteRepoItem) => {
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

  return (
    <TabPanel>
      <Grid
        maxH={500}
        templateColumns="repeat(5, 1fr)"
        overflowY={"scroll"}
        gap={6}
      >
        {repos && repos.items && (
          <Fragment>
            <ViewRemoteRepoModal
              isOpen={isOpen}
              onClose={onClose}
              repo={activeRepo!}
            />
            {repos.items.map((repo) => (
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
            ))}
          </Fragment>
        )}
      </Grid>
    </TabPanel>
  );
};

export default RemoteRepos;
