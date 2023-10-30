import { Select } from "@chakra-ui/react";
import { FC } from "react";

interface IRepoBranchesProps {
  localBranches: string[] | undefined;
  remoteBranches: string[] | undefined;
  currentBranch: string | undefined;
  onBranchChange: (newBranch: string) => void;
}

const RepoBranches: FC<IRepoBranchesProps> = ({
  localBranches,
  remoteBranches,
  currentBranch,
  onBranchChange,
}) => {
  if (localBranches === undefined || remoteBranches === undefined) {
    return <Select placeholder="Branches"></Select>;
  }

  return (
    <Select
      onChange={(event) => onBranchChange(event.target.value)}
      placeholder={currentBranch}
      defaultValue={currentBranch}
    >
      <optgroup label="Local">
        {localBranches.map((branch, index) => (
          <option
            selected={branch.toLowerCase() === currentBranch!.toLowerCase()}
            key={index}
            value={branch}
          >
            {branch}
          </option>
        ))}
      </optgroup>
      <optgroup label="Remotes">
        {remoteBranches.map((branch, index) => (
          <option
            selected={branch.toLowerCase() === currentBranch!.toLowerCase()}
            key={index}
            value={branch}
          >
            {branch}
          </option>
        ))}
      </optgroup>
    </Select>
  );
};

export default RepoBranches;
