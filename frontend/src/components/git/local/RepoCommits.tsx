import { Box, Divider, Grid, GridItem, Input, Text } from "@chakra-ui/react";
import { GetCommitDiff } from "@go/main/App";
import { data } from "@go/models";
import { FC, Fragment, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

interface IRepoCommitsProps {
  repo: string;
  commits: data.RepoCommit[];
}

const RepoCommits: FC<IRepoCommitsProps> = ({ repo, commits }) => {
  const [diffs, setDiffs] = useState<data.CommitDiff[]>([]);
  const [contents, setContents] = useState<(typeof diffs)[number]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommits, setFilteredCommits] = useState(commits);
  const [activeHash, setActiveHash] = useState("");

  const handleViewCommit = async (hash: string) => {
    setActiveHash(hash);

    const currentHashIndex = commits.findIndex((x) => x.hash === hash);

    const prevHash = commits[currentHashIndex + 1].hash;

    const diffs = await GetCommitDiff(repo, hash, prevHash);

    setDiffs(() => diffs);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === "") {
      setFilteredCommits(commits);
      return;
    }

    setFilteredCommits(
      commits.filter((commit) =>
        commit.message.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  };

  if (commits === undefined || commits.length === 0) {
    return <Text>No Commits</Text>;
  }

  useEffect(() => {
    if (commits && commits.length > 0) {
      setActiveHash(commits[0].hash);
      handleViewCommit(commits[0].hash);
    }
  }, []);

  useEffect(() => {
    setContents(diffs[0]);
  }, [diffs]);

  return (
    <Fragment>
      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
        <GridItem>
          <Input
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value)}
            mb={4}
            placeholder={"Search commit message"}
          />
          <Box
            overflowY={"scroll"}
            h={"53vh"}
            w="30vw"
            p={4}
            borderWidth="1px"
            borderRadius="md"
          >
            {filteredCommits.map((commit) => (
              <Box
                key={commit.hash}
                onClick={() => handleViewCommit(commit.hash)}
                borderRadius={10}
                padding={2}
                backgroundColor={
                  activeHash === commit.hash ? "peru" : undefined
                }
              >
                <Text fontSize="lg">{commit.message}</Text>
                <Text
                  fontSize="sm"
                  color={activeHash === commit.hash ? "white" : "gray.500"}
                >
                  {`${commit.committerName} <${commit.committerEmail}> | ${commit.date}`}
                </Text>
                <Divider my={2} />
              </Box>
            ))}
          </Box>
        </GridItem>
        <GridItem w={200}>
          {diffs.length > 0 && (
            <Box overflowY={"scroll"} h={"60vh"}>
              {diffs.map((diff) => (
                <Box
                  key={diff.file}
                  borderRadius={10}
                  padding={2}
                  backgroundColor={
                    contents?.file === diff.file ? "peru" : undefined
                  }
                  onClick={() => {
                    setContents(() => diff);
                  }}
                >
                  <Text fontSize="lg">{diff.file}</Text>
                  <Divider my={2} />
                </Box>
              ))}
            </Box>
          )}
        </GridItem>
        <GridItem>
          {contents && (
            <Box overflowY={"scroll"} h={"62vh"}>
              <ReactDiffViewer
                oldValue={contents.prevContent}
                newValue={contents.currentContent}
                splitView={false}
              />
            </Box>
          )}
        </GridItem>
      </Grid>
    </Fragment>
  );
};

export default RepoCommits;
