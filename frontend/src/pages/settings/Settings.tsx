import { GetGitTokens, GetSettings, SaveSettings } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { selectedAppModules } from "@src/states/nav/AppModulesAtom";
import { useAtom } from "jotai";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Checkbox } from "@src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@src/components/ui/radio-group";
import { Label } from "@src/components/ui/label";
import { Separator } from "@src/components/ui/separator";

function Settings() {
  const [gitSettings, setGitSettings] = useState<data.OneJsonGit>({
    username: "",
    token: "",
  });
  const [availableGitTokens, setAvailableGitTokens] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(false);

  const availableAppModules = ["Git & Github", "Directories", "Network"];

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
    <div key={token} className="flex items-center space-x-2">
      <RadioGroupItem value={token} id={token} />
      <Label htmlFor={token} className="cursor-pointer">
        {token}
      </Label>
    </div>
  ));

  const appModulesCheckBox = availableAppModules.map((module) => (
    <div key={module} className="flex items-center space-x-2">
      <Checkbox
        id={module}
        checked={selectedModules.includes(module)}
        onCheckedChange={(checked) => {
          if (checked) {
            setSelectedModules((prev) => [...prev, module]);
          } else {
            setSelectedModules((prev) => prev.filter((m) => m !== module));
          }
        }}
      />
      <Label htmlFor={module} className="cursor-pointer">
        {module}
      </Label>
    </div>
  ));

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        <div className="space-y-4 w-full max-w-2xl">
          <div className="w-full">
            <h2 className="text-lg font-bold mb-2">App modules</h2>
            <div className="space-y-2">{appModulesCheckBox}</div>
          </div>

          {selectedModules.includes("Git & Github") && (
            <div className="w-full">
              <h2 className="text-lg font-bold mb-2">Git Settings</h2>
              <Separator className="mb-4" />
              <div className="space-y-4">
                <Input
                  type="text"
                  onChange={(event) =>
                    updateGitSettings("username", event.target.value)
                  }
                  value={gitSettings.username}
                  placeholder="Username"
                  className="text-lg"
                />
                <Input
                  value={gitSettings.token}
                  type="text"
                  onChange={(event) =>
                    updateGitSettings("token", event.target.value)
                  }
                  placeholder="Git token"
                  className="text-lg"
                />
                {availableGitTokens && (
                  <RadioGroup
                    value={gitSettings.token}
                    onValueChange={(value) => updateGitSettings("token", value)}
                  >
                    <div className="space-y-2">{gitTokensRadio}</div>
                  </RadioGroup>
                )}
                <Button
                  onClick={findAvailableGitTokens}
                  variant="default"
                  size="sm"
                  className="mt-8 bg-teal-600 hover:bg-teal-700"
                >
                  Find available Tokens
                </Button>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={saveSettings}
          size="lg"
          className="mt-8 bg-teal-600 hover:bg-teal-700"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default Settings;
