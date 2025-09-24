import { 
    Modal, 
    ModalBody,
    ModalCloseButton, 
    ModalContent, 
    ModalHeader, 
    ModalOverlay, 
    ModalFooter, 
    Button, 
    Flex, 
    Text, 
    Icon 
} from '@chakra-ui/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import request from '../utils/httpsRequest';
import { WarningIcon } from '@chakra-ui/icons';
import type { EmployeeEvent } from '../utils/types';
import { useUserAuthContext } from '../context/user/user.hook';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchingEvents: () => void;
  selectedEvent: EmployeeEvent | null;
}
const ApprovalModal = ({isOpen, onClose, fetchingEvents, selectedEvent}: ApprovalModalProps) => {
    const { token } = useUserAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const confirmAction = async () => {
        setIsLoading(true);
        const payload = [selectedEvent?.id];
        try {
            const response = await request({ token }).put(`/api/EmployeeEvents/approve-employee-event`, payload);
            if (response && response.status === 200) {
                toast.success('Employee event approved successfully!');
                fetchingEvents();
                onClose();
            }
        } catch (error) {
            setIsLoading(false);
            toast.error('Failed to approve employee event. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
      <ModalContent borderRadius="2xl" boxShadow="2xl" p={2}>
        <ModalHeader textAlign="center" fontWeight="bold" color="red.500" fontSize="xl" pb={0}>
          Event Approval
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" align="center" justify="center" py={6}>
            <Icon as={WarningIcon} boxSize={12} color="red.400" mb={3} />
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
              Approve this event?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center" mb={2}>
              Please confirm your action. This cannot be undone.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center" gap={3}>
          <Button onClick={onClose} variant="outline" colorScheme="gray" px={6}>
            Cancel
          </Button>
          <Button flex={1} colorScheme="red" onClick={confirmAction} isLoading={isLoading} disabled={isLoading} px={6}>
            Approve
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ApprovalModal