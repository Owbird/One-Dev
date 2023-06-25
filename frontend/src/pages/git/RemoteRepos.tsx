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
  Spinner,
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
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleSave = async () => {
    await SaveGitToken(gitToken);

    setGitTokens(undefined);
  };

  useEffect(() => {
    GetGitToken().then(setGitToken);
  }, []);

  useEffect(() => {
    setHasLoaded(false);

    if (gitToken === "") {
      GetGitTokens().then((tokens) => {
        setGitToken(tokens[0]);
        setGitTokens(tokens);
      });
    } else {
      setGitToken(gitToken);
      GetRemoteRepos(gitToken).then(setRepos);
    }

    setHasLoaded(true);
  }, [gitToken]);

  if (!hasLoaded) return <Spinner />;

  if (gitTokens && !repos) {
    return (
      <Fragment>
        <List spacing={3}>
          <RadioGroup onChange={setGitToken} value={gitToken}>
            {gitTokens!.map((token) => (
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
    </TabPanel>
  );
};

export default RemoteRepos;
