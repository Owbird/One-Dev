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
import { ChangeBranch, GetRepo } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineBranches, AiOutlineTag } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const ViewLocalRepo = () => {
  const [repoData, setRepoData] = useState<data.Repo>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dir = queryParams.get("dir");
  const navigate = useNavigate();

  useEffect(() => {
    GetRepo(dir!).then(setRepoData);
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
    await ChangeBranch(repoData?.parentDir!, branch);
    GetRepo(repoData?.parentDir!).then(setRepoData);
  };

  return repoData?.currentBranch == "" ? (
    <Fragment>
      <HStack>
        <IoIosArrowBack onClick={() => navigate(-1)} size={50} />
        <Heading>{repoData?.dir}</Heading>
      </HStack>
      <Center>
        <Heading>Empty Repo?</Heading>
      </Center>
    </Fragment>
  ) : (
    <Fragment>
      <HStack>
        <IoIosArrowBack onClick={() => navigate(-1)} size={50} />
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
            {repoData?.branches.map((branch, index) => (
              <option
                selected={
                  branch.toLowerCase() === repoData!.currentBranch.toLowerCase()
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
              {!repoData?.changes ? (
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
              )}
            </TabPanel>
            <TabPanel>
              {repoData?.commits &&
                repoData?.commits.map((commit) => (
                  <Fragment key={commit.hash}>
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

export default ViewLocalRepo;
