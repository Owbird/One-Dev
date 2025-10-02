import { GetSettings, SaveSettings } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Button } from "@src/components/ui/button";
import { Checkbox } from "@src/components/ui/checkbox";
import { Label } from "@src/components/ui/label";

function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  const availableAppModules = ["Git & Github", "Directories", "Network"];

  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const getSettings = async () => {
    setIsLoading(true);
    const settings = await GetSettings();

    if (settings.modules) {
      setSelectedModules(settings.modules);
    }
        setIsLoading(false);

  };

  const saveSettings = async () => {
    const newSettings = {
      modules: selectedModules,
    } as data.OneJson;

    await SaveSettings(newSettings);

    enqueueSnackbar("Settings saved", { variant: "success" });
  };

  useEffect(() => {
    getSettings();
  }, []);

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
