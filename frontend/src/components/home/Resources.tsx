import { GetSystemResources, GetWakaToday } from "@go/main/App";
import { data } from "@go/models";
import { useEffect, useState } from "react";
import {
  BsClock,
  BsLaptop,
  BsBatteryHalf,
  BsCpu,
  BsMemory,
} from "react-icons/bs";
import Loader from "../shared/Loader";
import BatteryLevel from "./BatteryLevel";
import CPUUsage from "./CPUUsage";
import RamUsage from "./RamUsage";
import ResourceCard from "./ResourceCard";

const Resources = () => {
  const [wakaToday, setWakaToday] = useState("0");
  const [resources, setResources] = useState<data.SystemResources>();

  const getWakaToday = async () => {
    try {
      const data = await GetWakaToday();
      setWakaToday(data);
    } catch (error) {
      console.error("Failed to get WakaTime data:", error);
    }
  };

  const getResources = async () => {
    try {
      const resources = await GetSystemResources();
      setResources(resources);
    } catch (error) {
      console.error("Failed to get system resources:", error);
    }
  };

  useEffect(() => {
    getResources();
    const timerID = setInterval(() => getResources(), 2000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    if (resources?.hasWaka) {
      getWakaToday();
      const timerID = setInterval(getWakaToday, 1000 * 60 * 5);
      return () => clearInterval(timerID);
    }
  }, [resources?.hasWaka]);

  if (!resources) {
    return <Loader />;
  }

  return (
    <div className="p-4 text-gray-300">
      <ResourceCard title="Local IPs" className="mb-4">
        <div className="mb-4 flex gap-4 items-center">
          {resources.localIPs.map(({ ip, interface: iface }) => (
            <p key={ip} className="text-sm text-gray-400">
              {ip} ({iface})
            </p>
          ))}
        </div>
      </ResourceCard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResourceCard
          title="Uptime"
          icon={<BsClock className="text-gray-400" />}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {resources.uptime.days > 0 && (
              <span>
                {resources.uptime.days} Day
                {resources.uptime.days === 1 ? "" : "s"}
              </span>
            )}
            <span>{resources.uptime.hours} Hours</span>
            <span>{resources.uptime.minutes} Minutes</span>
          </div>
        </ResourceCard>

        {wakaToday !== "0" && (
          <ResourceCard
            title="WakaTime Today"
            icon={<BsLaptop className="text-gray-400" />}
          >
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{wakaToday}</span>
            </div>
          </ResourceCard>
        )}

        <ResourceCard
          title="Battery"
          icon={<BsBatteryHalf className="text-gray-400" />}
        >
          <BatteryLevel batteryStats={resources.batteryStats} />
        </ResourceCard>

        <ResourceCard
          title="RAM Usage"
          icon={<BsMemory className="text-gray-400" />}
        >
          <RamUsage memoryStats={resources.memoryStats} />
        </ResourceCard>

        <ResourceCard
          title="CPU Usage"
          icon={<BsCpu className="text-gray-400" />}
          className="lg:col-span-2"
        >
          <CPUUsage cpuStats={resources.cpuStats} />
        </ResourceCard>
      </div>
    </div>
  );
};

export default Resources;
