import { Progress } from "@chakra-ui/react";
import { FC } from "react";

interface StatProgressBar {
  colorScheme: string;
  value: number;
}
const StatProgressBar: FC<StatProgressBar> = ({ colorScheme, value }) => {
  return (
    <Progress
      width={100}
      borderRadius={"md"}
      colorScheme={colorScheme}
      height="32px"
      value={value}
    />
  );
};

export default StatProgressBar;
