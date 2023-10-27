import {
  Badge,
  Box,
  Center,
  Divider,
  HStack,
  Heading,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { WindowSetTitle } from "@go-runtime/runtime";
import { ChangeBranch, GetRepo } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { SnackbarMessage, enqueueSnackbar } from "notistack";
import { FC, Fragment, useEffect, useState } from "react";
import { AiOutlineBranches, AiOutlineTag } from "react-icons/ai";

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

  const getChangeColor = (change: string): string => {
    switch (change) {
      case "N":
        return "green";
      case " ":
        return "yellow";
      case "M":
        return "yellow";
      case "A":
        return "green";
      case "D":
        return "red";
      default:
        break;
    }

    return "gray";
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

  const branches = repoData?.branches.map((branch, index) => (
    <option
      selected={branch.toLowerCase() === repoData!.currentBranch.toLowerCase()}
      key={index}
      value={branch}
    >
      {branch}
    </option>
  ));

  const tagsComponent =
    repoData?.tags === null ? (
      <Select placeholder={"No tags"}></Select>
    ) : (
      <Select placeholder={repoData?.currentBranch}>
        {repoData?.tags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </Select>
    );

  const changesComponent = !repoData?.changes ? (
    <Text>No local changes</Text>
  ) : (
    repoData?.changes.map((change) => (
      <Fragment key={change.file}>
        <HStack>
          <Text>{change.file}</Text>
          <Badge colorScheme={getChangeColor(change.change)}>
            {change.change}
          </Badge>
        </HStack>
      </Fragment>
    ))
  );

  const commitsComponent = (
    <Box p={4} borderWidth="1px" borderRadius="md">
      {repoData?.commits.map((commit) => (
        <Fragment key={commit.hash}>
          <Text fontSize="lg">{commit.message}</Text>
          <Text fontSize="sm" color="gray.500">
            {`${commit.committerName} <${commit.committerEmail}> | ${commit.date}`}
          </Text>
          <Divider my={2} />
        </Fragment>
      ))}
    </Box>
  );

  const contributorsComponent = repoData?.analytics.contributors.map(
    (contributor, index) => (
      <Box key={index} bg="gray.100" p={4} mb={2} borderRadius="md">
        <Heading as="h3" size="md">
          {contributor.contributor}
        </Heading>
        <Text>
          Total Contributions: {contributor.totalCommits} (
          {contributor.percentage}%)
        </Text>
      </Box>
    ),
  );

  const technologiesComponent = repoData?.analytics.technologies.map(
    (technology, index) => (
      <Box key={index} bg="gray.100" p={4} mb={2} borderRadius="md">
        <Heading as="h3" size="md">
          {technology.technology}
        </Heading>
        <Text>Count: {technology.count} </Text>
      </Box>
    ),
  );

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
        <AiOutlineBranches /> <Badge>{repoData?.branches.length}</Badge>
        <Badge color={"green"}>{repoData?.currentBranch}</Badge>
      </HStack>
      <Stack ml={5} mt={5} width={500}>
        <HStack>
          <AiOutlineBranches size={60} />
          <Select
            onChange={(event) => handleBranchChnage(event.target.value)}
            placeholder={repoData?.currentBranch}
            defaultValue={repoData?.currentBranch}
          >
            {branches}
          </Select>
          <AiOutlineTag size={60} />
          {tagsComponent}
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
                {changesComponent}
              </Box>
            </TabPanel>
            <TabPanel>
              {repoData?.commits && (
                <Box overflowY="auto" maxHeight="100vh">
                  {commitsComponent}
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              <TabPanel>
                <Box>
                  <Heading as="h2" size="lg" mb={2}>
                    Total Commits
                  </Heading>
                  <Text>{repoData?.commits.length}</Text>
                  <Heading as="h2" size="lg" mb={2}>
                    Contributors ({repoData?.analytics.contributors.length})
                  </Heading>
                  <Box overflowY="auto" maxHeight="400">
                    {contributorsComponent}
                  </Box>
                  <Heading as="h2" size="lg" mb={2}>
                    Technologies ({repoData?.analytics.technologies.length})
                  </Heading>
                  <Box overflowY="auto" maxHeight="400">
                    {technologiesComponent}
                  </Box>
                </Box>
              </TabPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Fragment>
  );
};

export default ViewLocalRepo;
