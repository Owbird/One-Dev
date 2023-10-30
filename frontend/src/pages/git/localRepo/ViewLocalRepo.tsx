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
import { WindowSetTitle } from "@go-runtime/runtime";
import { ChangeBranch, GetRepo } from "@go/main/App";
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
import { FaSync } from "react-icons/fa";

interface IViewLocalRepoProps {
  repo: string;
}

const ViewLocalRepo: FC<IViewLocalRepoProps> = ({ repo }) => {
  const [repoData, setRepoData] = useState<data.Repo>();
  const [isLoading, setIsLoading] = useState(false);

  const getRepo = async (dir: string) => {
    setIsLoading(true);
    const repo = await GetRepo(dir);
    setRepoData(repo);
    setIsLoading(false);
  };

  useEffect(() => {
    getRepo(repo!);
  }, []);

  useEffect(() => {
    if (repoData) {
      WindowSetTitle(`One Dev | Git & Github | ${repoData?.dir}`);
    }
  }, [repoData]);

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
          {repoData?.localBranches.length! + repoData?.remoteBranches.length!}
        </Badge>
        <Badge color={"green"}>{repoData?.currentBranch}</Badge>
        <Box pl={60}>
          <FaSync onClick={() => getRepo(repoData?.parentDir!)} />
        </Box>
      </HStack>
      <Stack ml={5} mt={5} width={500}>
        <HStack>
          <AiOutlineBranches size={60} />
          <RepoBranches
            localBranches={repoData?.localBranches}
            remoteBranches={repoData?.remoteBranches}
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
              <Box overflowY="auto" maxHeight="100vh">
                <RepoChanges
                  changes={repoData?.changes}
                  parentDir={repoData?.parentDir!}
                  refreshRepo={() => getRepo(repoData?.parentDir!)}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box overflowY="auto" maxHeight="100vh">
                <RepoCommits commits={repoData?.commits!} />
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
