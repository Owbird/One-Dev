import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { FC } from "react";

interface IRepoTagsProps {
  tags: string[];
}

const RepoTags: FC<IRepoTagsProps> = ({ tags }) => {
  if (tags === undefined || tags.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="No tags" />
        </SelectTrigger>
        <SelectContent>{/* Empty content for disabled state */}</SelectContent>
      </Select>
    );
  }

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Tags" />
      </SelectTrigger>
      <SelectContent>
        {tags.map((tag, index) => (
          <SelectItem key={index} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RepoTags;
