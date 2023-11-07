import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GetDirectories, OpenFile } from "@go/main/App";
import { data } from "@go/models";
import { useEffect, useMemo, useState } from "react";
import { FcFile, FcFolder } from "react-icons/fc";

function Directories() {
  const [directories, setDirectories] = useState<data.Directory[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const badgeColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    getDirectories(currentPath);
  }, [currentPath, showHiddenFiles]);

  const getDirectories = (path: string) => {
    GetDirectories(path, showHiddenFiles).then(setDirectories);
  };

  const handleDirectoryClick = async (directory: data.Directory) => {
    if (directory.isDir) {
      setCurrentPath(directory.path);
    } else {
      OpenFile(directory.path);
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
            color={badgeColor}
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
              color={badgeColor}
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

      <Button onClick={() => setShowHiddenFiles(!showHiddenFiles)}>
        {showHiddenFiles ? "Hide hidden files" : "show hidden files"}
      </Button>

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
