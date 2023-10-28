import { Select } from "@chakra-ui/react";
import { FC } from "react";

interface ILocalBranchesProps {
  branches: string[] | undefined;
  currentBranch: string | undefined;
  onBranchChange: (newBranch: string) => void;
}

const LocalBranches: FC<ILocalBranchesProps> = ({
  branches,
  currentBranch,
  onBranchChange,
}) => {
  if (branches === undefined) {
    return <Select placeholder="Branches"></Select>;
  }

  return (
    <Select
      onChange={(event) => onBranchChange(event.target.value)}
      placeholder={currentBranch}
      defaultValue={currentBranch}
    >
      {branches.map((branch, index) => (
        <option
          selected={branch.toLowerCase() === currentBranch!.toLowerCase()}
          key={index}
          value={branch}
        >
          {branch}
        </option>
      ))}
    </Select>
  );
};

export default LocalBranches;
