import {
  Badge,
  Box,
  Center,
  HStack,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import {
  ChangeBranch,
  GetRemoteRepoBranches,
  GetRepo,
  PullFromOrigin,
  PushToOrigin,
} from "@go/main/App";
import { data } from "@go/models";
import RepoAnalytics from "@src/components/git/local/RepoAnalytics";
import RepoBranches from "@src/components/git/local/RepoBranches";
import RepoChanges from "@src/components/git/local/RepoChanges";
import RepoCommits from "@src/components/git/local/RepoCommits";
import RepoTags from "@src/components/git/local/RepoTags";
import Loader from "@src/components/shared/Loader";
import { SnackbarMessage, enqueueSnackbar } from "notistack";
import { FC, Fragment, useEffect, useState } from "react";
import { AiOutlineBranches, AiOutlineTag } from "react-icons/ai";
import { FaDownload, FaSync } from "react-icons/fa";
import { VscRepoPush } from "react-icons/vsc";
import useWindowFocus from "use-window-focus";

interface IViewLocalRepoProps {
  repo: string;
}

const ViewLocalRepo: FC<IViewLocalRepoProps> = ({ repo }) => {
  const [repoData, setRepoData] = useState<data.Repo>();
  const [isLoading, setIsLoading] = useState(false);
  const [remoteBranches, setRemoteBranches] = useState<string[]>([]);

  const windowFocused = useWindowFocus();

  useEffect(() => {
    if (windowFocused) getRepo(repo, true);
  }, [windowFocused]);

  const pushToOrigin = async () => {
    try {
      setIsLoading(true);

      await PushToOrigin(repoData?.parentDir!);

      enqueueSnackbar("Changes pushed to origin", { variant: "success" });
    } catch (error) {
      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const pullFromOrigin = async () => {
    try {
      setIsLoading(true);
      await PullFromOrigin(repo);
    } catch (error) {
      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getRepo = async (dir: string, silent = false) => {
    try {
      setIsLoading(!silent);

      const currentRepo = await GetRepo(dir);

      setRepoData(currentRepo);

      setIsLoading(false);

      const remoteBranches = await GetRemoteRepoBranches(dir);

      setRemoteBranches(remoteBranches);
    } catch (error) {
      setIsLoading(false);

      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    }
  };

  const handleBranchChnage = async (branch: string) => {
    try {
      setIsLoading(true);

      await ChangeBranch(repoData?.parentDir!, branch);
      await getRepo(repoData?.parentDir!);
    } catch (error) {
      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Repo is empty || Repo is broken
  if (repoData?.currentBranch === "") {
    return (
      <Fragment>
        <HStack>
          <Heading>{repoData?.dir}</Heading>
        </HStack>
        <Center>
          <Heading>Empty Repo?</Heading>
        </Center>
      </Fragment>
    );
  }

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Fragment>
      <HStack>
        <Heading>{repoData?.dir}</Heading>
        <AiOutlineBranches />{" "}
        <Badge>
          {repoData?.localBranches.length! + remoteBranches.length!}
        </Badge>
        <Badge color={"green"}>{repoData?.currentBranch}</Badge>
        <Box pl={60}>
          <HStack>
            <FaSync
              title="Refresh"
              onClick={() => getRepo(repoData?.parentDir!)}
            />
            <VscRepoPush title="Push" onClick={pushToOrigin} />
            <FaDownload title="Pull" onClick={pullFromOrigin} />
          </HStack>
        </Box>
      </HStack>
      <Stack ml={5} mt={5} width={500}>
        <HStack>
          <AiOutlineBranches size={60} />
          <RepoBranches
            localBranches={repoData?.localBranches}
            remoteBranches={remoteBranches}
            currentBranch={repoData?.currentBranch}
            onBranchChange={handleBranchChnage}
          />
          <AiOutlineTag size={60} />
          <RepoTags tags={repoData?.tags!} />
        </HStack>
        <Tabs>
          <TabList>
            <Tab>Changes</Tab>
            <Tab>History</Tab>
            <Tab>Analytics</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box>
                <RepoChanges
                  changes={repoData?.changes}
                  parentDir={repoData?.parentDir!}
                  refreshRepo={() => getRepo(repoData?.parentDir!)}
                />
              </Box>
            </TabPanel>
            <TabPanel w="85vw" ml={0} pl={0}>
              <Box>
                <RepoCommits
                  repo={repoData?.parentDir!}
                  commits={repoData?.commits!}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <RepoAnalytics
                totalCommits={repoData?.commits.length!}
                analytics={repoData?.analytics!}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Fragment>
  );
};

export default ViewLocalRepo;
