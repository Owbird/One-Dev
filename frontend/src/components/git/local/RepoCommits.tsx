import { Box, Divider, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";

interface IRepoCommitsProps {
  commits: data.RepoCommit[];
}

const RepoCommits: FC<IRepoCommitsProps> = ({ commits }) => {
  if (commits === undefined || commits.length === 0) {
    return <Text>No Commits</Text>;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      {commits.map((commit) => (
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
};

export default RepoCommits;
