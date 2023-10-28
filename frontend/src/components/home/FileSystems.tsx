import { GetFileSystems } from "@go/main/App";
import { data } from "@go/models";
import { useEffect, useState } from "react";
import DiskUsage from "./DiskUsage";

const FileSystems = () => {
  const [fileSystems, setFileSystems] = useState<data.DiskStats[]>([]);

  const getFileSystems = async () => {
    const _fileSystems = await GetFileSystems();

    setFileSystems(_fileSystems);
  };

  useEffect(() => {
    getFileSystems();
  }, []);

  return (
    <div>
      {fileSystems.map((disk) => (
        <DiskUsage key={disk.device} diskStats={disk} />
      ))}
    </div>
  );
};

export default FileSystems;
