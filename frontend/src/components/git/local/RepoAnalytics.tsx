import { Box, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { FC } from "react";
import RepoContributors from "./RepoContributors";
import RepoTechnologies from "./RepoTechnologies";

interface IRepoAnalyticsProps {
  analytics: data.RepoAnalytics;
  totalCommits: number;
}

const RepoAnalytics: FC<IRepoAnalyticsProps> = ({
  analytics,
  totalCommits,
}) => {
  if (analytics === undefined) {
    return <Loader />;
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={2}>
        Total Commits
      </Heading>
      <Text>{totalCommits}</Text>
      <Heading as="h2" size="lg" mb={2}>
        Contributors ({analytics.contributors.length})
      </Heading>
      <Box overflowY="auto" maxHeight="400">
        <RepoContributors contributors={analytics.contributors!} />
      </Box>
      <Heading as="h2" size="lg" mb={2}>
        Technologies ({analytics.technologies.length})
      </Heading>
      <Box overflowY="auto" maxHeight="400">
        <RepoTechnologies technologies={analytics.technologies!} />
      </Box>
    </Box>
  );
};

export default RepoAnalytics;
