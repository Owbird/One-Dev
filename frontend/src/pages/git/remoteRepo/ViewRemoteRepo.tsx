import {
  Avatar,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { CloneRepo } from "@go/git/GitFunctions";
import { data } from "@go/models";
import { FC, useState } from "react";

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
          <ModalHeader>
            <Flex align="center">
              <Avatar size="sm" src={repo.owner.avatarUrl} />
              <Text ml={2}>{repo.owner.login}</Text>
            </Flex>
          </ModalHeader>
          {!isCloning && <ModalCloseButton />}
          <ModalBody>
            {repo.description === "" ? "No description" : repo.description}
            <Text mt={2}>
              Language: {repo.primaryLanguage.name}
              <br />
              Stars: {repo.stargazerCount}
              <br />
              Forks: {repo.forkCount}
              <br />
              Watchers: {repo.watchers.totalCount}
            </Text>
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
