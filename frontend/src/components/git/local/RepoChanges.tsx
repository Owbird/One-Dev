import {
  Badge,
  Button,
  Checkbox,
  HStack,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CreateCommit } from "@go/main/App";
import { data } from "@go/models";
import { FC, Fragment, useState } from "react";

interface IRepoChangesProps {
  changes: data.RepoChange[] | undefined;
  parentDir: string;
  refreshRepo: () => void;
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
const RepoChanges: FC<IRepoChangesProps> = ({
  changes,
  parentDir,
  refreshRepo,
}) => {
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState("");

  if (changes === undefined || changes.length === 0) {
    return <Text>No Local Changes</Text>;
  }

  const toggleStageFile = (file: string) => {
    const isStaged = stagedFiles.includes(file);

    if (isStaged) {
      setStagedFiles((prev) => prev.filter((x) => x !== file));
    } else {
      setStagedFiles((prev) => [...prev, file]);
    }
  };

  const createCommit = async () => {
    const commitData: data.CreateCommit = {
      files: stagedFiles,
      message: commitMessage,
      repo: parentDir,
    };
    await CreateCommit(commitData);

    refreshRepo();
  };

  return (
    <Fragment>
      {stagedFiles.length !== 0 && (
        <Stack>
          <Textarea
            value={commitMessage}
            onChange={(event) => setCommitMessage(event.target.value)}
            placeholder="Commit message"
          />
          <Button
            isDisabled={commitMessage === ""}
            colorScheme={"blue"}
            onClick={createCommit}
          >
            Commit files ({stagedFiles.length})
          </Button>
        </Stack>
      )}
      {changes.map((change) => (
        <HStack>
          <Checkbox
            isChecked={stagedFiles.includes(change.file)}
            onChange={() => toggleStageFile(change.file)}
          />
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
