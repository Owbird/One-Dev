import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";

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
    return (
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="loading" disabled>
            Loading branches...
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentBranch} onValueChange={onBranchChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={currentBranch || "Select branch"} />
      </SelectTrigger>
      <SelectContent>
        {localBranches.length > 0 && (
          <SelectGroup>
            <SelectLabel>Local</SelectLabel>
            {localBranches.map((branch, index) => (
              <SelectItem key={`local-${index}`} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        {remoteBranches.length > 0 && (
          <SelectGroup>
            <SelectLabel>Remotes</SelectLabel>
            {remoteBranches.map((branch, index) => (
              <SelectItem key={`remote-${index}`} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default RepoBranches;
