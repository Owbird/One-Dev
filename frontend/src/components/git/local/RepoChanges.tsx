import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Checkbox } from "@src/components/ui/checkbox";
import { Textarea } from "@src/components/ui/textarea";
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
    case "A":
    case "U":
      return "text-green-400";
    case " ":
    case "M":
      return "text-yellow-400";
    case "D":
      return "text-red-400";
    default:
      return "text-black";
  }
};

const RepoChanges: FC<IRepoChangesProps> = ({
  changes,
  parentDir,
  refreshRepo,
}) => {
  const [stagedFiles, setStagedFiles] = useState<string[]>(
    changes?.map((change) => change.file) as string[],
  );
  const [commitMessage, setCommitMessage] = useState("");

  if (changes === undefined || changes.length === 0) {
    return <p className="text-muted-foreground">No Local Changes</p>;
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
      <div className="space-y-4">
        <Textarea
          value={commitMessage}
          onChange={(event) => setCommitMessage(event.target.value)}
          placeholder="Commit message"
        />
        <Button disabled={commitMessage === ""} onClick={createCommit}>
          Commit files ({stagedFiles.length})
        </Button>
      </div>
      <div className="space-y-2">
        {changes.map((change, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Checkbox
              checked={stagedFiles.includes(change.file)}
              onCheckedChange={() => toggleStageFile(change.file)}
            />
            <span className="flex-1">{change.file}</span>
            <Badge className={`bg-white ${getChangeColor(change.status)}`}>
              {change.status}
            </Badge>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default RepoChanges;
