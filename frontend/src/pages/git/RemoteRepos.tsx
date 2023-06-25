import {
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
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { GetGitTokens } from "@go/git/GitFunctions";
import { GetGitToken, GetRemoteRepos, SaveGitToken } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";

const RemoteRepos = () => {
  const [gitToken, setGitToken] = useState("");
  const [gitTokens, setGitTokens] = useState<string[]>();
  const [repos, setRepos] = useState<data.RemoteRepo>();

  const handleSave = async () => {
    await SaveGitToken(gitToken);

    setGitTokens(undefined);

    await GetRemoteRepos(gitToken).then(setRepos);
  };

  useEffect(() => {
    GetGitToken().then(setGitToken);
  }, []);

  useEffect(() => {
    if (gitToken === "") {
      GetGitTokens().then((tokens) => {
        setGitToken(tokens[0]);
        setGitTokens(tokens);
      });
    } else {
      GetRemoteRepos(gitToken).then(setRepos);
    }
  }, [gitToken]);
  return (
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
          templateColumns="repeat(5, 1fr)"
          overflowY={"scroll"}
          gap={6}
        >
          {repos &&
            repos.items.map((repo) => (
              <GridItem
                key={repo.id}
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
  );
};

export default RemoteRepos;
