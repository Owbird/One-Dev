import { GetSystemResources, GetWakaToday } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import Loader from "../shared/Loader";
import BatteryLevel from "./BatteryLevel";
import CPUUsage from "./CPUUsage";
import IPView from "./IPView";
import RamUsage from "./RamUsage";
import UpTimeView from "./UpTimeView";
import WakaTimeToday from "./WakaTimeToday";

const Resources = () => {
  const [wakaToday, setWakaToday] = useState("0");
  const [resources, setResources] = useState<data.SystemResources>();

  const getWakaToday = async () => {
    const data = await GetWakaToday();

    setWakaToday(data);

    const timerID = setInterval(async () => {
      const data = await GetWakaToday();
      setWakaToday(data);
    }, 1000 * 60 * 5);
  };

  const getResources = async () => {
    const resources = await GetSystemResources();
    setResources(resources);
  };

  useEffect(() => {
    const timerID = setInterval(() => getResources(), 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    if (resources?.hasWaka) {
      getWakaToday();
    }
  }, [resources?.hasWaka]);

  if (!resources) {
    return <Loader />;
  }

  return (
    <Fragment>
      <IPView ip={resources.localIP} />
      <UpTimeView uptime={resources.uptime} />
      <WakaTimeToday time={wakaToday} />
      <BatteryLevel batteryStats={resources.batteryStats} />
      <RamUsage memoryStats={resources.memoryStats} />
      <CPUUsage cpuStats={resources.cpuStats} />
    </Fragment>
  );
};

export default Resources;
