import { GetRemoteRepos } from "@go/main/App";
import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { remoteReposAtom } from "@src/states/git/RemoteReposAtom";
import { useAtom } from "jotai";
import { enqueueSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import ViewRemoteRepoModal from "./ViewRemoteRepo";
import { format } from "timeago.js";
import { ghColors } from "@src/data/constants";
import { FaStar, FaClock, FaClone, FaDatabase } from "react-icons/fa";
import { Badge } from "@src/components/ui/badge";

const RemoteRepos = () => {
  const [repos, setRepos] = useAtom(remoteReposAtom);
  const [activeRepo, setActiveRepo] = useState<data.RemoteRepo>();
  const [isLoading, setIsLoading] = useState(repos.length === 0);
  const [isOpen, setIsOpen] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  };

  useEffect(() => {
    GetRemoteRepos()
      .then((repos) => {
        setRepos(repos);
        setIsLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRepoView = (repo: data.RemoteRepo) => {
    setActiveRepo(repo);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }

  const repoGridItem = repos?.map((repo) => {
    const langColor = ghColors[repo.primaryLanguage.name as keyof typeof ghColors];
    return (
      <div
        key={repo.id}
        onClick={() => handleRepoView(repo)}
        className="w-full p-5 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors flex flex-col justify-between items-start space-y-3"
      >
        <div className="flex items-center space-x-2">
          {repo.isPrivate && (
            <Badge variant="secondary">private</Badge>
          )}
          <Badge 
            style={{ 
              backgroundColor: langColor ? langColor.color! : "#6b7280",
              color: "white" 
            }}
          >
            {repo.primaryLanguage.name}
          </Badge>
        </div>
        
        <p className="text-white font-medium">
          {repo.owner.login}/{repo.name}
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1 text-white">
            <FaStar />
            <span className="text-sm">{repo.stargazerCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-white">
            <FaClone />
            <span className="text-sm">{repo.forkCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-white">
            <FaDatabase />
            <span className="text-sm">{formatBytes(repo.diskUsage)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-white">
          <FaClock />
          <span className="text-sm">{format(repo.updatedAt)}</span>
        </div>
      </div>
    );
  });

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-h-[500px] overflow-y-auto">
        {repos && (
          <Fragment>
            <ViewRemoteRepoModal
              isOpen={isOpen}
              onClose={handleClose}
              repo={activeRepo!}
            />
            {repoGridItem}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default RemoteRepos;
