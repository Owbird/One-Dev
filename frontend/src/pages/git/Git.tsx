import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  GetGitDirs,
  GetGitToken,
  GetGitTokens,
  GetRemoteRepos,
  SaveGitToken,
} from "@go/main/App";
import { data } from "@go/models";
import ActiveRepo from "@src/pages/git/ActiveRepo";
import { Fragment, useEffect, useState } from "react";

const Git = () => {
  const [dirs, setDirs] = useState<data.File[]>([]);
  const [searchRes, setSearchRes] = useState<data.File[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [gitToken, setGitToken] = useState("");
  const [gitTokens, setGitTokens] = useState<string[]>();
  const [activeDir, setActiveRepo] = useState<data.File>();
  const [repos, setRepos] = useState<data.RemoteRepo>();

  const clearActiveDir = () => {
    setActiveRepo(undefined);
  };

  useEffect(() => {
    GetGitDirs().then(setDirs);
    GetGitToken().then((token) => {
      if (token === "") {
        GetGitTokens().then((tokens) => {
          setGitToken(tokens[0]);
          setGitTokens(tokens);
        });
      } else {
        GetRemoteRepos(token).then(setRepos);
      }
    });
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

  const handleSave = async () => {
    alert(gitToken);
    await SaveGitToken(gitToken);

    setGitTokens(undefined);

    await GetRemoteRepos(gitToken);
  };

  return (
    <Box>
      {!activeDir ? (
        <Tabs>
          <TabList>
            <Tab>Local ({dirs.length})</Tab>
            <Tab>Remote ({repos ? repos.total_count : 0})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Divider width={20} />
              <br />
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
                  <GridItem
                    onClick={() => setActiveRepo(dir)}
                    w="100%"
                    h="100%"
                    p={5}
                    bg="blue.500"
                  >
                    <p>{dir.dir}</p>
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>
              {gitTokens ? (
                <Fragment>
                  <List spacing={3}>
                    <RadioGroup onChange={setGitToken} value={gitToken}>
                      {gitTokens.map((token) => (
                        <ListItem key={token}>
                          <HStack>
                            <Radio value={token}>
                              <Text>{token}</Text>
                            </Radio>
                          </HStack>
                        </ListItem>
                      ))}
                    </RadioGroup>
                  </List>{" "}
                  <HStack>
                    <Divider />
                    <Text>OR</Text>
                    <Divider />
                  </HStack>
                  <Input
                    onChange={(event) => setGitToken(event.target.value)}
                    placeholder="Use another token"
                  />
                  <Button mt={4} onClick={handleSave}>
                    Save
                  </Button>
                </Fragment>
              ) : (
                <Grid
                  maxH={500}
                  overflowY={"scroll"}
                  templateColumns="repeat(5, 1fr)"
                  gap={6}
                >
                  {repos &&
                    repos.items.map((repo) => (
                      <GridItem
                        // onClick={() => setActiveRepo(dir)}
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
                </Grid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <ActiveRepo repo={activeDir} clear={clearActiveDir} />
      )}
    </Box>
  );
};

export default Git;
