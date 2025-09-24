import { 
    Badge,
    Box, 
    Button, 
    HStack, 
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuList, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead, 
    Tr, 
    useDisclosure} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import request from "../utils/httpsRequest";
import { useUserAuthContext } from "../context/user/user.hook";
import type { Event, EventResponse } from "../utils/types";
import AddEvent from "../components/AddEvent";
import DeleteModal from "../components/DeleteModal";
import EditEvent from "../components/EditEvent";

const Events = () => {

    const { token } = useUserAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [events, setEvents] = useState<EventResponse | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<number>();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { isOpen: isDeleteModalOpen, onClose: onDeleteModalClose, onOpen: onDeleteModalOpen } = useDisclosure();
    const { isOpen: isEditModalOpen, onClose: onEditModalClose, onOpen: onEditModalOpen } = useDisclosure();

    const fetchingEvents = async () => {
        setIsLoading(true);
        try {
            const response = await request({token}).get('/api/Events');
            if (response && response.status === 200) {
                setEvents(response.data);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to fetch events:', error);
            toast.error('Failed to fetch events. Please try again.');
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchingEvents();
        }
    }, [token]);

    const handleDeleteEvent = async () => {
        if(!deletingEventId) return;
        setIsLoading(true);
        try {
            const response = await request({ token }).delete(`/api/Events/${deletingEventId}`);
            if (response && response.status === 200) {
                toast.success('Event deleted successfully!');
                fetchingEvents();
                onDeleteModalClose();
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
            toast.error('Failed to delete event. Please try again.');
        } finally{
            setIsLoading(false);
            setDeletingEventId(undefined);
        }
    }

  return (
    <div className="flex min-h-screen">
         <div className="fixed left-0 top-0 h-screen w-64 z-20 bg-white shadow-lg">
            <Sidebar />
        </div>
        <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
            <Box mb={6}>
                <HStack justify={"space-between"}>
                    <Box>
                        <Text className="text-2xl font-bold mb-1">Events Types</Text>
                        <Text className="text-gray-700 mb-6">Manage your events types effectively.</Text>
                    </Box>
                    <Button isLoading={isLoading} onClick={onOpen} colorScheme="red" size="sm">Add Event</Button>
                </HStack>
            </Box>
            <TableContainer>
                <Table variant='simple' border={"1px solid #edf2f7"}>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Name</Th>
                            <Th>Message</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                        isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Loading events...</span>
                                    </div>
                                </td>
                            </tr>
                        ) :
                        events?.data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                    No events found.
                                </td>
                            </tr>
                        ) : (
                            events?.data?.map((event: Event, index: number) => (
                                <Tr key={index}>
                                    <Td className="text-sm font-medium text-gray-700">{index + 1}</Td>
                                    <Td className="text-sm font-medium text-gray-700">{event.name}</Td>
                                    <Td noOfLines={1} className="text-sm font-medium text-gray-700 max-w-sm">
                                        <span className="">{event.message}</span>
                                    </Td>
                                    <Td className="text-sm font-medium text-gray-700">
                                        <Badge colorScheme={"green"} variant="subtle">
                                            Active
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton as={Button} size="sm" variant="ghost">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem 
                                                onClick={
                                                    () => {
                                                    setSelectedEvent(event);
                                                    onEditModalOpen();
                                                }}
                                                className="text-sm font-medium text-gray-700">
                                                    Edit
                                                </MenuItem>
                                                <MenuItem  
                                                className="text-sm font-medium text-gray-700" 
                                                color="red.500" 
                                                onClick={() => {
                                                    setDeletingEventId(event.id);
                                                    onDeleteModalOpen();
                                                }}>
                                                    Delete
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Td>
                                </Tr>
                            ))
                        )
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </main>

        <AddEvent isOpen={isOpen} onClose={onClose} fetchingEvents={fetchingEvents} />
        <EditEvent 
        isOpen={isEditModalOpen} 
        onClose={onEditModalClose} 
        fetchingEvents={fetchingEvents} 
        event={selectedEvent}
         />
        <DeleteModal 
        title="Delete Event"
        isLoading={isLoading}
        isOpen={isDeleteModalOpen} 
        onClose={onDeleteModalClose} 
        confirmAction={handleDeleteEvent} 
        />
    </div>
  )
}

export default Events