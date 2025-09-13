import { CloneRepo } from "@go/git/GitFunctions";
import { data } from "@go/models";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";

interface ViewRemoteRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  repo: data.RemoteRepo;
}

const ViewRemoteRepoModal: FC<ViewRemoteRepoModalProps> = ({
  isOpen,
  onClose,
  repo,
}) => {
  const [isCloning, setIsCloning] = useState(false);

  const handleClone = async () => {
    setIsCloning(true);
    await CloneRepo(repo.url, repo.name);
    setIsCloning(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!isCloning) {
      onClose();
    }
  };

  if (!repo) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={repo.owner.avatarUrl} alt={repo.owner.login} />
              <AvatarFallback>
                {repo.owner.login.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{repo.owner.login}</span>
          </DialogTitle>
          <DialogDescription>
            {repo.description === "" ? "No description" : repo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <div>
            <strong>Language:</strong> {repo.primaryLanguage.name}
          </div>
          <div>
            <strong>Stars:</strong> {repo.stargazerCount}
          </div>
          <div>
            <strong>Forks:</strong> {repo.forkCount}
          </div>
          <div>
            <strong>Watchers:</strong> {repo.watchers.totalCount}
          </div>
        </div>

        <DialogFooter>
          {!isCloning && (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
          <Button
            onClick={handleClone}
            disabled={isCloning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCloning ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Cloning...</span>
              </div>
            ) : (
              "Clone"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRemoteRepoModal;
