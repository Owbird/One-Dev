import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { GetSystemStat, GetWakaToday } from "@go/main/App";
import { data } from "@go/models";
import BatteryLevel from "@src/components/home/BatteryLevel";
import CPUUsage from "@src/components/home/CPUUsage";
import Greeting from "@src/components/home/Greeting";
import IPView from "@src/components/home/IPView";
import Processess from "@src/components/home/Processess";
import RamUsage from "@src/components/home/RamUsage";
import UpTimeView from "@src/components/home/UpTimeView";
import WakaTimeToday from "@src/components/home/WakaTimeToday";
import Loader from "@src/components/shared/Loader";
import { Fragment, useEffect, useState } from "react";

const Home = () => {
  const [systemStats, setSystemStats] = useState<data.SystemStats>();
  const [wakaToday, setWakaToday] = useState("0");

  const _getSystemStat = async () => {
    const data = await GetSystemStat();
    setSystemStats(data);
  };

  const _getWakaToday = async () => {
    const data = await GetWakaToday();

    setWakaToday(data);

    const timerID = setInterval(async () => {
      const data = await GetWakaToday();
      setWakaToday(data);
    }, 1000 * 60 * 5);
  };

  useEffect(() => {
    const timerID = setInterval(() => _getSystemStat(), 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    if (systemStats?.hasWaka) {
      _getWakaToday();
    }
  }, [systemStats?.hasWaka]);

  if (!systemStats) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Greeting userMeta={systemStats?.userMeta!} />
      <VStack alignItems={"flex-start"}>
        <Tabs>
          <TabList>
            <Tab>Resources</Tab>
            <Tab>Processes</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <IPView ip={systemStats.localIP} />
              <UpTimeView uptime={systemStats.uptime} />
              <WakaTimeToday time={wakaToday} />
              <BatteryLevel batteryStats={systemStats.batteryStats} />
              <RamUsage memoryStats={systemStats.memoryStats} />
              <CPUUsage cpuStats={systemStats.cpuStats} />
            </TabPanel>
            <TabPanel>
              <Processess processes={systemStats.processes} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Fragment>
  );
};

export default Home;
