import { Box, Divider, Grid, GridItem, Text } from "@chakra-ui/react";
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

  const handleViewCommit = async (hash: string) => {
    const currentHashIndex = commits.findIndex((x) => x.hash === hash);

    const prevHash = commits[currentHashIndex + 1].hash;

    const diffs = await GetCommitDiff(repo, hash, prevHash);

    setDiffs(() => diffs);
  };

  if (commits === undefined || commits.length === 0) {
    return <Text>No Commits</Text>;
  }

  useEffect(() => {
    handleViewCommit(commits[0].hash);
  }, []);

  useEffect(() => {
    setContents(diffs[0]);
  }, [diffs]);

  return (
    <Fragment>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem>
          <Box w="30vw" p={4} borderWidth="1px" borderRadius="md">
            {commits.map((commit) => (
              <Box
                key={commit.hash}
                onClick={() => handleViewCommit(commit.hash)}
              >
                <Text fontSize="lg">{commit.message}</Text>
                <Text fontSize="sm" color="gray.500">
                  {`${commit.committerName} <${commit.committerEmail}> | ${commit.date}`}
                </Text>
                <Divider my={2} />
              </Box>
            ))}
          </Box>
        </GridItem>
        <GridItem w={200}>
          {diffs.length > 0 && (
            <Box>
              {diffs.map((diff) => (
                <Box
                  key={diff.file}
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
            <Box>
              <ReactDiffViewer
                oldValue={contents.prevContent}
                newValue={contents.currentContent}
                splitView={true}
              />
            </Box>
          )}
        </GridItem>
      </Grid>
    </Fragment>
  );
};

export default RepoCommits;
