import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { CloneRepo } from "@go/git/GitFunctions";
import { data } from "@go/models";
import { useState } from "react";

const ViewRemoteRepoModal = ({
  isOpen,
  onClose,
  repo,
}: {
  isOpen: boolean;
  onClose: () => void;
  repo: data.RemoteRepo;
}) => {
  const [isCloning, setIsCloning] = useState(false);

  const handleClone = async () => {
    setIsCloning(true);
    await CloneRepo(repo.htmlURL, repo.name);
    setIsCloning(false);
  };
  return (
    <Modal
      closeOnOverlayClick={!isCloning}
      closeOnEsc={!isCloning}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      {repo && (
        <ModalContent>
          <ModalHeader>{repo.name}</ModalHeader>
          {!isCloning && <ModalCloseButton />}
          <ModalBody>
            {repo.description === "" ? "No description" : repo.description}
          </ModalBody>

          <ModalFooter>
            {!isCloning && (
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
            )}
            <Button
              isLoading={isCloning}
              loadingText="Cloning..."
              colorScheme="blue"
              onClick={handleClone}
            >
              Clone
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default ViewRemoteRepoModal;
