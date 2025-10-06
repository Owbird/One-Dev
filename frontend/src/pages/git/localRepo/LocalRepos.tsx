import { GetGitDirs, GetIndexedRepos } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { localReposAtom } from "@src/states/git/LocalReposAtom";
import { openedTabsAtom, tabIndexAtom } from "@src/states/nav/TabsAtom";
import { useAtom, useSetAtom } from "jotai";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Input } from "@src/components/ui/input";
import { Badge } from "@src/components/ui/badge";
import { Separator } from "@src/components/ui/separator";
import ViewLocalRepo from "./ViewLocalRepo";

const LocalRepos = () => {
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [openedTabs, setOpenedTabs] = useAtom(openedTabsAtom);
  const [dirs, setDirs] = useAtom(localReposAtom);
  const [isLoading, setIsLoading] = useState(dirs.length === 0);
  const [searchRes, setSearchRes] = useState<data.File[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const setTabIndex = useSetAtom(tabIndexAtom);

  useEffect(() => {
    GetIndexedRepos().then((dirs) => {
      setDirs(dirs);
      setIsLoading(false);
    });
  }, []);

  // Update index in background
  useEffect(() => {
    GetGitDirs().then((dirs) => {
      setDirs(dirs);
      enqueueSnackbar("Local repos index updated", {
        variant: "success",
      });
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isLoading) {
        setIsTakingLong(true);
      }
    }, 15000);
  }, []);

  const viewRepo = (repo: data.File) => {
    const alreadyOpenedIndex = openedTabs.findIndex(
      (x) => x.label === repo.dir,
    );
    if (alreadyOpenedIndex === -1) {
      setOpenedTabs([
        ...openedTabs,
        {
          body: <ViewLocalRepo key={repo.parentDir} repo={repo.parentDir} />,
          label: repo.dir,
          source: "git",
          meta: repo,
        },
      ]);
      setTabIndex(openedTabs.length);
    } else {
      setTabIndex(alreadyOpenedIndex);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setSearchRes(undefined);
    } else {
      setSearchRes(
        dirs.filter((dir) =>
          dir.dir.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader />
          {isTakingLong && (
            <p className="mt-4 text-gray-600">
              This is taking longer than expected!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Separator className="w-20 mb-4" />

      <Input
        value={searchQuery}
        onChange={(event) => handleSearch(event.target.value)}
        className="mb-4"
        placeholder="Search..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto">
        {(searchRes ?? dirs).map((dir) => (
          <div
            key={dir.parentDir}
            onClick={() => viewRepo(dir)}
            className="w-full p-5 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <Badge variant="secondary" className="mb-2">
              {dir.user}
            </Badge>
            <p className="text-white font-medium">{dir.dir}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalRepos;
