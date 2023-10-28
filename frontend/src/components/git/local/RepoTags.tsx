import { Select } from "@chakra-ui/react";
import { FC } from "react";

interface IRepoTagsProps {
  tags: string[];
}

const RepoTags: FC<IRepoTagsProps> = ({ tags }) => {
  if (tags === undefined || tags.length === 0) {
    return <Select placeholder={"No tags"}></Select>;
  }

  return (
    <Select placeholder={"Tags"}>
      {tags.map((tag, index) => (
        <option key={index} value={tag}>
          {tag}
        </option>
      ))}
    </Select>
  );
};

export default RepoTags;
