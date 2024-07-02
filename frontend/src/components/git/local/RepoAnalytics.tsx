import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { FC } from "react";
import RepoContributedDays from "./RepoContributedDays";
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
    <Grid templateColumns={'repeat(3, 1fr)'} gap={5}>
      <GridItem>
        <Heading as="h2" color="green.500" size="lg" mb={2}>
          {totalCommits} Commits
        </Heading>
        <Heading as="h2" size="lg" mb={2}>
          Contributors ({analytics.contributors.length})
        </Heading>
        <Box overflowY="auto" maxHeight="400">
          <RepoContributors contributors={analytics.contributors!} />
        </Box>
      </GridItem>

      <GridItem>
        <Heading as="h2" size="lg" mb={2}>
          Days Contributed
        </Heading>
        <Box overflowY="auto" maxHeight="400">
          <RepoContributedDays days={analytics.contributedDays!} />
        </Box>
      </GridItem>

      <GridItem>
        <Heading as="h2" size="lg" mb={2}>
          Technologies ({analytics.technologies.length})
        </Heading>
        <Box overflowY="auto" maxHeight="400">
          <RepoTechnologies technologies={analytics.technologies!} />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default RepoAnalytics;
