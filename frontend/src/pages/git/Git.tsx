import { localReposAtom } from "@src/states/git/LocalReposAtom";
import { remoteReposAtom } from "@src/states/git/RemoteReposAtom";
import { useAtomValue } from "jotai";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs";
import LocalRepos from "./localRepo/LocalRepos";
import RemoteRepos from "./remoteRepo/RemoteRepos";

const Git = () => {
  const totalLocal = useAtomValue(localReposAtom);
  const totalRemote = useAtomValue(remoteReposAtom);

  return (
    <div>
      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local">
            Local {totalLocal.length !== 0 && `(${totalLocal.length})`}
          </TabsTrigger>
          <TabsTrigger value="remote">
            Remote {totalRemote.length !== 0 && `(${totalRemote.length})`}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="mt-4">
          <LocalRepos />
        </TabsContent>
        <TabsContent value="remote" className="mt-4">
          <RemoteRepos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Git;
