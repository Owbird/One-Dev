import { Badge, HStack, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";

interface IRepoChangesProps {
  changes: data.RepoChange[] | undefined;
}
const getChangeColor = (change: string): string => {
  switch (change) {
    case "N":
      return "green";
    case " ":
      return "yellow";
    case "M":
      return "yellow";
    case "A":
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
          <Badge colorScheme={getChangeColor(change.change)}>
            {change.change}
          </Badge>
        </HStack>
      ))}
    </Fragment>
  );
};

export default RepoChanges;
