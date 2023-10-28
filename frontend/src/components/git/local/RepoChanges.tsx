import { Badge, HStack, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";

interface IRepoChangesProps {
  changes: data.RepoChange[] | undefined;
}
const getChangeColor = (status: string): string => {
  switch (status) {
    case "N":
      return "green";
    case " ":
      return "yellow";
    case "M":
      return "yellow";
    case "A":
    case "U":
      return "green";
    case "D":
      return "red";
    default:
      break;
  }

  return "gray";
};
const RepoChanges: FC<IRepoChangesProps> = ({ changes }) => {
  if (changes === undefined || changes.length === 0) {
    return <Text>No Local Changes</Text>;
  }
  return (
    <Fragment>
      {changes.map((change) => (
        <HStack key={change.file}>
          <Text>{change.file}</Text>
          <Badge colorScheme={getChangeColor(change.status)}>
            {change.status}
          </Badge>
        </HStack>
      ))}
    </Fragment>
  );
};

export default RepoChanges;
