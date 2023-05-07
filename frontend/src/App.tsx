import { VStack } from "@chakra-ui/react";
import { GetSystemStat } from "@go/main/App";
import { data } from "@go/models";
import SideBar from "@src/components/shared/SideBar";
import { useEffect, useState } from "react";
import BatteryLevel from "./components/home/BatteryLevel";
import CPUUsage from "./components/home/CPUUsage";
import Greeting from "./components/home/Greeting";
import Processess from "./components/home/Processess";
import RamUsage from "./components/home/RamUsage";
import UpTimeView from "./components/home/UpTimeView";

const App = () => {
  const [systemStats, setSystemStats] = useState<data.SystemStats>();

  const _getSystemStat = async () => {
    const data = await GetSystemStat();
    setSystemStats(data);
  };

  useEffect(() => {
    const timerID = setInterval(() => _getSystemStat(), 1000);
    return () => clearInterval(timerID);
  }, []);

  return (
    <SideBar>
      <>
        <Greeting />
        {systemStats && (
          <>
            <VStack alignItems={"flex-start"}>
              <UpTimeView uptime={systemStats.uptime} />
              <BatteryLevel batteryStats={systemStats.batteryStats} />
              <RamUsage memoryStats={systemStats.memoryStats} />
              <CPUUsage cpuStats={systemStats.cpuStats} />
              <Processess processes={systemStats.processes} />
            </VStack>
          </>
        )}
      </>
    </SideBar>
  );
};

export default App;
