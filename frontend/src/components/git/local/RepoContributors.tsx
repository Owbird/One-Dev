import { Box, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";

interface IRepoContributorsProps {
  contributors: data.RepoContributors[];
}

const RepoContributors: FC<IRepoContributorsProps> = ({ contributors }) => {
  if (contributors === undefined || contributors.length === 0) {
    return <Text>No Contributors</Text>;
  }

  return (
    <Fragment>
      {contributors.map((contributor) => (
        <Box key={contributor.contributor} p={4} mb={2} borderRadius="md">
          <Heading as="h3" size="md">
            {contributor.contributor}
          </Heading>
          <Text>
            Total Contributions: {contributor.totalCommits} (
            {contributor.percentage}%)
          </Text>
        </Box>
      ))}
    </Fragment>
  );
};

export default RepoContributors;
