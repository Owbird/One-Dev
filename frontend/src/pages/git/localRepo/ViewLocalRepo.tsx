import {
  ChangeBranch,
  GetRemoteRepoBranches,
  GetRepo,
  PullFromOrigin,
  PushToOrigin,
} from "@go/main/App";
import { data } from "@go/models";
import RepoAnalytics from "@src/components/git/local/RepoAnalytics";
import RepoBranches from "@src/components/git/local/RepoBranches";
import RepoChanges from "@src/components/git/local/RepoChanges";
import RepoCommits from "@src/components/git/local/RepoCommits";
import RepoTags from "@src/components/git/local/RepoTags";
import Loader from "@src/components/shared/Loader";
import { SnackbarMessage, enqueueSnackbar } from "notistack";
import { FC, Fragment, useEffect, useState } from "react";
import { AiOutlineBranches, AiOutlineTag } from "react-icons/ai";
import { FaDownload, FaSync } from "react-icons/fa";
import { VscRepoPush } from "react-icons/vsc";
import useWindowFocus from "use-window-focus";
import { Badge } from "@src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs";

interface IViewLocalRepoProps {
  repo: string;
}

const ViewLocalRepo: FC<IViewLocalRepoProps> = ({ repo }) => {
  const [repoData, setRepoData] = useState<data.Repo>();
  const [isLoading, setIsLoading] = useState(false);
  const [remoteBranches, setRemoteBranches] = useState<string[]>([]);

  const windowFocused = useWindowFocus();

  useEffect(() => {
    if (windowFocused) getRepo(repo, true);
  }, [windowFocused]);

  const pushToOrigin = async () => {
    try {
      setIsLoading(true);

      await PushToOrigin(repoData?.parentDir!);

      enqueueSnackbar("Changes pushed to origin", { variant: "success" });
    } catch (error) {
      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const pullFromOrigin = async () => {
    try {
      setIsLoading(true);
      await PullFromOrigin(repo);
    } catch (error) {
      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getRepo = async (dir: string, silent = false) => {
    try {
      setIsLoading(!silent);

      const currentRepo = await GetRepo(dir);

      setRepoData(currentRepo);

      setIsLoading(false);

      const remoteBranches = await GetRemoteRepoBranches(dir);

      setRemoteBranches(remoteBranches);
    } catch (error) {
      setIsLoading(false);

      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    }
  };

  const handleBranchChnage = async (branch: string) => {
    try {
      setIsLoading(true);

      await ChangeBranch(repoData?.parentDir!, branch);
      await getRepo(repoData?.parentDir!);
    } catch (error) {
      const errorText: SnackbarMessage = error as string;
      enqueueSnackbar(errorText, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Repo is empty || Repo is broken
  if (repoData?.currentBranch === "") {
    return (
      <Fragment>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{repoData?.dir}</h1>
        </div>
        <div className="flex items-center justify-center mt-8">
          <h2 className="text-xl">Empty Repo?</h2>
        </div>
      </Fragment>
    );
  }

  if (isLoading || !repoData) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex items-center  space-x-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{repoData?.dir}</h1>
          <AiOutlineBranches />
          <Badge variant="secondary">
            {repoData?.localBranches.length! + remoteBranches.length!}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {repoData?.currentBranch}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <FaSync
            className="cursor-pointer hover:text-blue-600 transition-colors"
            title="Refresh"
            onClick={() => getRepo(repoData?.parentDir!)}
          />
          <VscRepoPush
            className="cursor-pointer hover:text-blue-600 transition-colors"
            title="Push"
            onClick={pushToOrigin}
          />
          <FaDownload
            className="cursor-pointer hover:text-blue-600 transition-colors"
            title="Pull"
            onClick={pullFromOrigin}
          />
        </div>
      </div>

      <div className="ml-5 mt-5">
        <div className="flex items-center space-x-4 mb-6">
          <AiOutlineBranches size={60} />
          <RepoBranches
            localBranches={repoData?.localBranches}
            remoteBranches={remoteBranches}
            currentBranch={repoData?.currentBranch}
            onBranchChange={handleBranchChnage}
          />
          <AiOutlineTag size={60} />
          <RepoTags tags={repoData?.tags!} />
        </div>

        <Tabs defaultValue="changes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="changes">Changes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="changes" className="mt-4">
            <div>
              <RepoChanges
                changes={repoData?.changes}
                parentDir={repoData?.parentDir!}
                refreshRepo={() => getRepo(repoData?.parentDir!)}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div>
              <RepoCommits
                repo={repoData?.parentDir!}
                commits={repoData?.commits!}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <RepoAnalytics
              totalCommits={repoData?.commits.length!}
              analytics={repoData?.analytics!}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default ViewLocalRepo;
