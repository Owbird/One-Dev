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

const ViewRemoteRepoModal = ({
  isOpen,
  onClose,
  repo,
}: {
  isOpen: boolean;
  onClose: () => void;
  repo: data.RemoteRepo;
}) => {
  const handleClone = () => {
    CloneRepo(repo.html_url, repo.name);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {repo && (
        <ModalContent>
          <ModalHeader>{repo.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {repo.description === "" ? "No description" : repo.description}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleClone}>
              Clone
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default ViewRemoteRepoModal;
