import { data } from "@go/models";
import DiskUsage from "./DiskUsage";

const FileSystems = ({ systems }: { systems: data.DiskStats[] }) => {
  const disks = systems.map((disk) => (
    <DiskUsage key={disk.device} diskStats={disk} />
  ));
  return <div>{disks}</div>;
};

export default FileSystems;
