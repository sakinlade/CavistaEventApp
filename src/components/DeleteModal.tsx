import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Button, Flex, Text, Icon } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading?: boolean;
  confirmAction: () => void;
}

const DeleteModal = ({ isOpen, onClose, title, isLoading, confirmAction }: DeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" align="center" justify="center" py={4}>
            <Icon as={WarningIcon} boxSize={10} color="red.400" mb={2} />
            <Text fontSize="lg" fontWeight="semibold" color="red.500" mb={2}>
              Are you sure you want to delete this event?
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              This action cannot be undone.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="outline" mr={3}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={confirmAction} isLoading={isLoading}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal