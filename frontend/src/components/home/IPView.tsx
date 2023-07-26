import { Text } from "@chakra-ui/react";

const IPView = ({ ip }: { ip: string }) => {
  return <Text color={"gray.500"}>{ip}</Text>;
};

export default IPView;
