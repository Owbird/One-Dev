import {
  Badge,
  Grid,
  Text,
  HStack,
  TabPanel,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { GetRemoteRepos } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { remoteReposAtom } from "@src/states/git/RemoteReposAtom";
import { useAtom } from "jotai";
import { enqueueSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import ViewRemoteRepoModal from "./ViewRemoteRepo";
import { format } from "timeago.js";
import { ghColors } from "@src/data/constants";
import { FaStar, FaClock, FaClone, FaDatabase } from "react-icons/fa";

const RemoteRepos = () => {
  const [repos, setRepos] = useAtom(remoteReposAtom);
  const [activeRepo, setActiveRepo] = useState<data.RemoteRepo>();
  const [isLoading, setIsLoading] = useState(repos.length === 0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  };

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
  }, [])

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

  const repoGridItem = repos?.map((repo) => {
    const langColor = ghColors[repo.primaryLanguage.name as keyof typeof ghColors];
    return (
      <VStack
        borderRadius={"10px"}
        key={repo.id}
        onClick={() => handleRepoView(repo)}
        w="100%"
        h="100%"
        alignItems={"start"}
        justifyContent={"space-between"}
        p={5}
        bg="blue.500"
      >
        <HStack>
          {repo.isPrivate && <Badge>private</Badge>}
          <Badge background={langColor ? langColor.color! : ""} color="white">
            {repo.primaryLanguage.name}
          </Badge>
        </HStack>
        <Text>
          {repo.owner.login}/{repo.name}
        </Text>
        <HStack justifyContent={"center"} alignContent="center">
          <HStack>
            <FaStar /> <Text>{repo.stargazerCount}</Text>
          </HStack>
          <HStack>
            <FaClone /> <Text>{repo.forkCount}</Text>
          </HStack>
          <HStack>
            <FaDatabase /> <Text>{formatBytes(repo.diskUsage)}</Text>
          </HStack>
        </HStack>
        <HStack>
          <FaClock /> <Text>{format(repo.updatedAt)}</Text>
        </HStack>
      </VStack>
    );
  });


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
