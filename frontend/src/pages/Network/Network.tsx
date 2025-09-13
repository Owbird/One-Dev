import { FetchLocalIp, IsHostAlive, ResolveHostname } from "@go/main/App";
import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";
import { Card, CardContent } from "@src/components/ui/card";

export default function Network() {
  const [ip, setIp] = useState<string | null>(null);
  
  useEffect(() => {
    FetchLocalIp().then((ip) => setIp(ip));
  }, []);

  if (!ip) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
        <span>Detecting local network...</span>
      </div>
    );
  }

  const parts = ip.split(".");
  const hostOctet = ip.split(".")[3];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        <HostCard host={ip} isSelf={true} />
        {Array.from({ length: 256 }).map(
          (_, index) =>
            index.toString() !== hostOctet && (
              <HostCard
                key={index}
                host={`${parts[0]}.${parts[1]}.${parts[2]}.${index}`}
              />
            ),
        )}
      </div>
    </div>
  );
}

const HostCard = ({
  host,
  isSelf = false,
}: {
  host: string;
  isSelf?: boolean;
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    IsHostAlive(host).then((isOnline) => {
      setIsOnline(isOnline);
      ResolveHostname(host).then(setName);
    });
  }, [host, isSelf]);

  if (isOnline === null) {
    return (
      <Card className="h-[100px] border border-gray-200">
        <CardContent className="p-0 h-full">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isOnline) {
    return null;
  }

  return (
    <Card 
      className={`h-[100px] border border-gray-200 ${
        isSelf ? "bg-yellow-50" : "bg-green-50"
      }`}
    >
      <CardContent className="p-0 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-1">
            <FaWifi className="w-6 h-6" />
            <span className="text-xs font-mono">{host}</span>
            <span className="text-[10px] text-gray-500">{name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
