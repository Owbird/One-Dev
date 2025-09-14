import { FetchLocalIps, IsHostAlive, ResolveHostname } from "@go/main/App";
import { Fragment, useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";
import { Card, CardContent } from "@src/components/ui/card";
import { data } from "@go/models";

export default function Network() {
  const [ips, setIps] = useState<data.Ip[] | null>(null);

  useEffect(() => {
    FetchLocalIps().then((ips) => setIps(ips));
  }, []);

  if (!ips) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
        <span>Detecting local network...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {ips.map((ip, index) => {
          const parts = ip.ip.split(".");
          const hostOctet = ip.ip.split(".")[3];

          return (
            <Fragment key={index}>
              <HostCard host={ip} isSelf={true} />
              {Array.from({ length: 256 }).map(
                (_, rangeIndex) =>
                  rangeIndex.toString() !== hostOctet && (
                    <HostCard
                      key={`${index}-${rangeIndex}`}
                      host={{
                        ip: `${parts[0]}.${parts[1]}.${parts[2]}.${rangeIndex}`,
                        interface: ip.interface,
                      }}
                    />
                  ),
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const HostCard = ({
  host,
  isSelf = false,
}: {
  host: data.Ip;
  isSelf?: boolean;
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("");
  const { ip, interface: iface } = host;

  useEffect(() => {
    IsHostAlive(ip).then((isOnline) => {
      setIsOnline(isOnline);
      ResolveHostname(ip).then(setName);
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
      className={`h-[120px] rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.02] ${
        isSelf
          ? "bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200"
          : "bg-gradient-to-br from-green-100 to-green-50 border-green-200"
      }`}
    >
      <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
        <FaWifi
          className={`w-7 h-7 ${
            isSelf ? "text-yellow-700" : "text-green-700"
          } mb-2`}
        />
        <span className="text-sm font-mono font-semibold text-gray-800">
          {ip}
        </span>
        <span className="text-xs text-gray-600">{name || "Unknown"}</span>
        <span className="text-[11px] text-gray-500">{iface}</span>
        {isSelf && (
          <span className="mt-1 text-[10px] font-medium text-yellow-700">
            (You)
          </span>
        )}
      </CardContent>
    </Card>
  );
};
