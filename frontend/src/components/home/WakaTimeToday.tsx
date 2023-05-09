import { HStack, Text } from "@chakra-ui/react";
import { BsLaptop } from "react-icons/bs";

const WakaTimeToday = ({ time }: { time: string }) => {
  return time !== "0" ? (
    <>
      <Text>WakaTime</Text>
      <HStack>
        <BsLaptop />

        <Text>{time}</Text>
      </HStack>
    </>
  ) : (
    <></>
  );
};

export default WakaTimeToday;
