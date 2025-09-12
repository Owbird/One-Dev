import {
  Box,
  Card,
  CardBody,
  Center,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FetchLocalIp, IsHostAlive, ResolveHostname } from "@go/main/App";
import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";

export default function Network() {
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    FetchLocalIp().then((ip) => setIp(ip));
  }, []);

  if (!ip) {
    return (
      <Center h="80vh">
        <Spinner />
        <Text ml={2}>Detecting local network...</Text>
      </Center>
    );
  }

  const parts = ip.split(".");
  const hostOctet = ip.split(".")[3];

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 2, sm: 4, md: 6, lg: 8 }} spacing={4}>
        <HostCard host={ip} isSelf={true} />
        {Array.from({ length: 256 }).map(
          (_, index) =>
            index.toString() !== hostOctet && (
              <HostCard
                key={index}
                host={`${parts[0]}.${parts[1]}.${parts[2]}.${index}`}
              />
            ),
        )}
      </SimpleGrid>
    </Box>
  );
}

const HostCard = ({
  host,
  isSelf = false,
}: {
  host: string;
  isSelf?: boolean;
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    IsHostAlive(host).then((isOnline) => {
      setIsOnline(isOnline);
      ResolveHostname(host).then(setName);
    });
  }, [host, isSelf]);

  if (isOnline === null) {
    return (
      <Card variant="outline" h="100px">
        <CardBody>
          <Center h="full">
            <Spinner size="sm" />
          </Center>
        </CardBody>
      </Card>
    );
  }

  if (!isOnline) {
    return null;
  }

  return (
    <Card variant="outline" h="100px" bg={isSelf ? "yellow.50" : "green.50"}>
      <CardBody>
        <Center h="full">
          <VStack spacing={1}>
            <Icon as={FaWifi} boxSize={6} />
            <Text fontSize="xs" fontFamily="mono">
              {host}
            </Text>{" "}
            <Text fontSize="2xs" color="gray.500">
              {name}
            </Text>
          </VStack>
        </Center>
      </CardBody>
    </Card>
  );
};

