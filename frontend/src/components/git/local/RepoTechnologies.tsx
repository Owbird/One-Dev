import { Box, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";

interface IRepoTechnologiesProps {
  technologies: data.RepoTechnologies[];
}

const RepoTechnologies: FC<IRepoTechnologiesProps> = ({ technologies }) => {
  if (technologies === undefined || technologies.length === 0) {
    return <Text>No Technologies</Text>;
  }
  return (
    <Fragment>
      {technologies.map((technology) => (
        <Box key={technology.technology} p={4} mb={2} borderRadius="md">
          <Heading as="h3" size="md">
            {technology.technology}
          </Heading>
          <Text>Count: {technology.count} </Text>
        </Box>
      ))}
    </Fragment>
  );
};

export default RepoTechnologies;
