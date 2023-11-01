import { Badge, Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { GetDirectories } from "@go/main/App";
import { data } from "@go/models";
import { useEffect, useMemo, useState } from "react";
import { FcFile, FcFolder } from "react-icons/fc";

function Directories() {
  const [directories, setDirectories] = useState<data.Directory[]>([]);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    getDirectories(currentPath);
  }, [currentPath]);

  const getDirectories = (path: string) => {
    GetDirectories(path).then((data) => {
      setDirectories(data);
    });
  };

  const handleDirectoryClick = async (directory: data.Directory) => {
    if (directory.isDir) {
      setCurrentPath(directory.path);
    }
  };

  const breadcrumbs = useMemo(
    () => currentPath.split("/").filter(Boolean),
    [currentPath],
  );

  return (
    <Box>
      <Flex align="center" mb={6}>
        <Box>
          <Badge
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() => setCurrentPath("/")}
          >
            {"/"}
          </Badge>
        </Box>

        {breadcrumbs.map((breadcrumb, index) => (
          <Box key={index}>
            <Badge
              fontSize="sm"
              fontWeight="bold"
              color="gray.600"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() =>
                setCurrentPath(`/${breadcrumbs.slice(0, index + 1).join("/")}`)
              }
            >
              {breadcrumb}
            </Badge>
          </Box>
        ))}
      </Flex>

      <Grid
        maxH={"100vh"}
        overflowY={"auto"}
        templateColumns="repeat(3, 1fr)"
        gap={6}
      >
        {directories.map((directory, index) => (
          <GridItem key={index}>
            <Box
              onDoubleClick={() => handleDirectoryClick(directory)}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              cursor={directory.isDir ? "pointer" : "default"}
              _hover={{ bg: "gray.100" }}
            >
              {directory.isDir ? <FcFolder size={40} /> : <FcFile size={40} />}
              <Text fontSize="lg" fontWeight="bold" mt={2}>
                {directory.name}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

export default Directories;
