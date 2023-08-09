import { HStack, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { BsLaptop } from "react-icons/bs";

const WakaTimeToday = ({ time }: { time: string }) => {
    return time !== "0" ? (
        <Fragment>
            <Text>WakaTime</Text>
            <HStack>
                <BsLaptop />

                <Text>{time}</Text>
            </HStack>
        </Fragment>
    ) : (
        <Fragment></Fragment>
    );
};

export default WakaTimeToday;
