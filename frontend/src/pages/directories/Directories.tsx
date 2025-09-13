import { GetDirectories, OpenFile } from "@go/main/App";
import { data } from "@go/models";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  Fragment,
} from "react";
import { FaSpinner } from "react-icons/fa";
import { FcFile, FcFolder } from "react-icons/fc";

function Directories() {
  const [directories, setDirectories] = useState<data.Directory[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDirectories = useCallback(
    async (path: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const dirs = await GetDirectories(path, showHiddenFiles);
        setDirectories(dirs);
      } catch (err: any) {
        setError(err.message || "Failed to fetch directories.");
      } finally {
        setIsLoading(false);
      }
    },
    [showHiddenFiles],
  );

  useEffect(() => {
    getDirectories(currentPath);
  }, [currentPath, getDirectories]);

  const handleItemClick = useCallback((directory: data.Directory) => {
    if (directory.isDir) {
      setCurrentPath(directory.path);
    } else {
      OpenFile(directory.path);
    }
  }, []);

  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split("/").filter(Boolean);
    return ["/", ...parts];
  }, [currentPath]);

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentPath("/");
      return;
    }
    const path = `/${breadcrumbs.slice(1, index + 1).join("/")}`;
    setCurrentPath(path);
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <Fragment key={index}>
              <Badge
                variant={
                  index === breadcrumbs.length - 1 ? "default" : "secondary"
                }
                className="text-sm font-bold cursor-pointer hover:underline"
                onClick={() => handleBreadcrumbClick(index)}
              >
                {breadcrumb === "/" ? "Root" : breadcrumb}
              </Badge>
              {index < breadcrumbs.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </Fragment>
          ))}
        </div>
        <Button
          onClick={() => setShowHiddenFiles((prev) => !prev)}
          variant="outline"
          size="sm"
        >
          {showHiddenFiles ? "Hide Hidden" : "Show Hidden"}
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="border-b">
              <th className="p-2 text-left font-medium">Name</th>
              <th className="p-2 text-left font-medium w-40">Type</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} className="text-center p-8">
                  <FaSpinner className="animate-spin text-2xl mx-auto" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={2} className="text-center p-8 text-red-500">
                  {error}
                </td>
              </tr>
            ) : (
              directories.map((item) => (
                <tr
                  key={item.path}
                  onDoubleClick={() => handleItemClick(item)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-2 flex items-center gap-2">
                    {item.isDir ? (
                      <FcFolder className="text-xl" />
                    ) : (
                      <FcFile className="text-xl" />
                    )}
                    <span className="truncate" title={item.name}>
                      {item.name}
                    </span>
                  </td>
                  <td className="p-2">{item.isDir ? "Folder" : "File"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(Directories);

