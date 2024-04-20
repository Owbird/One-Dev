import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GetGitTokens, GetSettings, SaveSettings } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { selectedAppModules } from "@src/states/nav/AppModulesAtom";
import { useAtom } from "jotai";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

function Settings() {
  const [gitSettings, setGitSettings] = useState<data.OneJsonGit>({
    username: "",
    token: "",
  });
  const [availableGitTokens, setAvailableGitTokens] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(false);

  const availableAppModules = ["Git & Github", "Directories"];

  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const updateGitSettings = (key: string, value: string) => {
    setGitSettings({
      ...gitSettings,
      [key]: value,
    });
  };

  const getSettings = async () => {
    const settings = await GetSettings();

    setGitSettings(settings.git);

    if (settings.modules) {
      setSelectedModules(settings.modules);
    }
  };

  const saveSettings = async () => {
    const newSettings = {
      git: gitSettings,
      modules: selectedModules,
    } as data.OneJson;

    await SaveSettings(newSettings);

    enqueueSnackbar("Settings saved", { variant: "success" });
  };

  const findAvailableGitTokens = async () => {
    setIsLoading(true);

    const tokens = await GetGitTokens();

    setIsLoading(false);

    setAvailableGitTokens(tokens);
  };

  useEffect(() => {
    getSettings();
  }, []);

  const gitTokensRadio = availableGitTokens?.map((token) => (
    <Radio key={token} value={token}>
      {token}
    </Radio>
  ));

  const appModulesCheckBox = availableAppModules.map((module) => (
    <Checkbox
      key={module}
      value={module}
      isChecked={selectedModules.includes(module)}
      onChange={() => {
        if (selectedModules.includes(module)) {
          setSelectedModules((prev) => prev.filter((m) => m !== module));
          return;
        }

        setSelectedModules((prev) => [...prev, module]);
      }}
    >
      {module}
    </Checkbox>
  ));

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box p={4}>
      <Flex direction="column" align="center">
        <Heading as="h1" size="xl" mb={4}>
          Settings
        </Heading>

        <VStack spacing={4} align="start" width="100%">
          <Box width="100%">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              App modules
            </Text>
            <VStack spacing={2} align="start">
              <Stack direction="column">{appModulesCheckBox}</Stack>
            </VStack>
          </Box>
          {selectedModules.includes("Git & Github") && (
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
                {availableGitTokens && (
                  <RadioGroup
                    onChange={(value) => updateGitSettings("token", value)}
                    value={gitSettings.token}
                  >
                    <Stack direction="column">{gitTokensRadio}</Stack>
                  </RadioGroup>
                )}
                <Button
                  onClick={findAvailableGitTokens}
                  colorScheme="teal"
                  size="xs"
                  mt={8}
                >
                  Find available Tokens
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>

        <Button onClick={saveSettings} colorScheme="teal" size="lg" mt={8}>
          Save Settings
        </Button>
      </Flex>
    </Box>
  );
}

export default Settings;
