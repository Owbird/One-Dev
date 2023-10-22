import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GetSettings, SaveSettings } from "@go/main/App";
import { data } from "@go/models";
import { useEffect, useState } from "react";

function Settings() {
  const [gitSettings, setGitSettings] = useState<data.OneJsonGit>({
    username: "",
    token: "",
  });

  const updateGitSettings = (key: string, value: string) => {
    setGitSettings({
      ...gitSettings,
      [key]: value,
    });
  };

  const getSettings = async () => {
    const settings = await GetSettings();

    setGitSettings(settings.git);
  };

  const saveSettings = async () => {
    const newSettings = {
      git: gitSettings,
    } as data.OneJson;

    await SaveSettings(newSettings);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Box p={4}>
      <Flex direction="column" align="center">
        <Heading as="h1" size="xl" mb={4}>
          Settings
        </Heading>

        <VStack spacing={4} align="start" width="100%">
          {/* Git Settings */}
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Git Settings
            </Text>
            <Divider />
            <VStack spacing={2} align="start">
              <Input
                type="text"
                onChange={(event) =>
                  updateGitSettings("username", event.target.value)
                }
                value={gitSettings.username}
                placeholder="Username"
                size="lg"
                variant="filled"
              />
              <Input
                value={gitSettings.token}
                type="text"
                onChange={(event) =>
                  updateGitSettings("token", event.target.value)
                }
                placeholder="Git token"
                size="lg"
                variant="filled"
              />
            </VStack>
          </Box>
          <Divider />
        </VStack>

        <Button onClick={saveSettings} colorScheme="teal" size="lg" mt={8}>
          Save Settings
        </Button>
      </Flex>
    </Box>
  );
}

export default Settings;
