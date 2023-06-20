import {
  Badge,
  Center,
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
import { ChangeBranch, GetRepo } from "@go/git/GitFunctions";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineBranches, AiOutlineTag } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";

const ActiveRepo = ({
  repo,
  clear,
}: {
  repo: data.File | undefined;
  clear: () => void;
}) => {
  const [repoData, setRepoData] = useState<data.Repo>();

  useEffect(() => {
    GetRepo(repo?.parentDir!).then(setRepoData);
  }, []);

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
    await ChangeBranch(repo?.parentDir!, branch);
    GetRepo(repo?.parentDir!).then(setRepoData);
  };

  return repoData?.currentBranch == "" ? (
    <Fragment>
      <HStack>
        <IoIosArrowBack onClick={clear} size={50} />
        <Heading>{repo?.dir}</Heading>
      </HStack>
      <Center>
        <Heading>Empty Repo?</Heading>
      </Center>
    </Fragment>
  ) : (
    <Fragment>
      <HStack>
        <IoIosArrowBack onClick={clear} size={50} />
        <Heading>{repo?.dir}</Heading>
        <AiOutlineBranches /> <Badge>{repoData?.branches.length}</Badge>
        <Badge color={"green"}>{repoData?.currentBranch}</Badge>
      </HStack>
      <Stack ml={5} mt={5} width={500}>
        <HStack>
          <AiOutlineBranches size={60} />
          <Select
            onChange={(event) => handleBranchChnage(event.target.value)}
            // placeholder={repoData?.currentBranch}
            defaultValue={repoData?.currentBranch}
          >
            {repoData?.branches.map((branch, index) => (
              <option
                selected={
                  branch.toLowerCase() === repoData.currentBranch.toLowerCase()
                }
                key={index}
                value={branch}
              >
                {branch}
              </option>
            ))}
          </Select>
          <AiOutlineTag size={60} />
          {repoData?.tags === null ? (
            <Select placeholder={"No tags"}></Select>
          ) : (
            <Select placeholder={repoData?.currentBranch}>
              {repoData?.tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>
          )}
        </HStack>

        <Tabs>
          <TabList>
            <Tab>Changes</Tab>
            <Tab>History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {repoData?.changes &&
                repoData?.changes.map((change) => (
                  <Fragment>
                    <HStack>
                      <Text>{change.file}</Text>
                      <Badge colorScheme={getChangeColor(change.change)}>
                        {change.change}
                      </Badge>
                    </HStack>
                  </Fragment>
                ))}
            </TabPanel>
            <TabPanel>
              {repoData?.commits &&
                repoData?.commits.map((commit) => (
                  <Fragment>
                    <Text>{commit.message}</Text>
                    <Text color={"gray.500"}>
                      {commit.committer} | {commit.date}
                    </Text>
                  </Fragment>
                ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Fragment>
  );
};

export default ActiveRepo;
