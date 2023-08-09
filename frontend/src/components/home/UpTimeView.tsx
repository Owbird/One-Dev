import { HStack, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { Fragment } from "react";
import { BsClock } from "react-icons/bs";

const UpTimeView = ({ uptime }: { uptime: data.UpTime }) => {
    return (
        <Fragment>
            <Text>Uptime</Text>
            <HStack>
                <BsClock />
                {uptime.days > 0 && (
                    <Text>
                        {uptime.days} Day{uptime.days === 1 ? "" : "s"}
                    </Text>
                )}
                <Text>{uptime.hours} Hours</Text>
                <Text>{uptime.minutes} Minutes</Text>
            </HStack>
        </Fragment>
    );
};

export default UpTimeView;
