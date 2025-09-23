import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { 
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
    useDisclosure 
} from '@chakra-ui/react';
import { useUserAuthContext } from '../context/user/user.hook';
import request from '../utils/httpsRequest';
import toast from 'react-hot-toast';
import type { Employee, EmployeeEvent, EmployeeEventsResponse, EventResponse } from '../utils/types';
import AddEmployeeEvent from '../components/AddEmployeeEvent';
import DeleteModal from '../components/DeleteModal';
import EditEmployeeEvent from '../components/EditEmployeeEvent';

const EmployeeEvents = () => {

    const { token } = useUserAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [events, setEvents] = useState<EventResponse | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EmployeeEvent | null>(null);
    const [employeeEvents, setEmployeeEvents] = useState<EmployeeEventsResponse | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<number>();
    const { isOpen: isDeleteModalOpen, onClose: onDeleteModalClose, onOpen: onDeleteModalOpen } = useDisclosure();
    const { isOpen: isEditModalOpen, onClose: onEditModalClose, onOpen: onEditModalOpen } = useDisclosure();

    const fetchingEmployeeEvents = async () => {
        try {
            const response = await request({token}).get('/api/EmployeeEvents');
            if (response && response.status === 200) {
                setEmployeeEvents(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            toast.error('Failed to fetch events. Please try again.');
        }
    }

    const fetchingEvents = async () => {
        try {
            const response = await request({token}).get('/api/Events');
            if (response && response.status === 200) {
                setEvents(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            toast.error('Failed to fetch events. Please try again.');
        }
    }

    const fetchingEmployees = async () => {
        try {
            const response = await request({token}).get('/api/Employees');
            if (response && response.status === 200) {
                setEmployees(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchingEmployeeEvents();
            fetchingEvents();
            fetchingEmployees();
        }
    }, [token]);

    const handleDeleteEvent = async () => {
        if(!deletingEventId) return;
        setIsLoading(true);
        try {
            const response = await request({ token }).delete(`/api/EmployeeEvents?id=${deletingEventId}`);
            if (response && response.status === 200) {
                toast.success('Employee event deleted successfully!');
                fetchingEmployeeEvents();
                onDeleteModalClose();
            }
        } catch (error) {
            console.error('Failed to delete employee event:', error);
            toast.error('Failed to delete employee event. Please try again.');
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
                        <Text className="text-2xl font-bold mb-1">Employee Events</Text>
                        <Text className="text-gray-700 mb-6">Manage your events effectively.</Text>
                    </Box>
                    <Button onClick={onOpen} colorScheme="red" size="sm">Add Employee Event</Button>
                </HStack>
            </Box>
            <TableContainer>
                <Table variant='simple' border={"1px solid #edf2f7"}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Event Name</Th>
                            <Th>Employee Name</Th>
                            <Th>Employee Email</Th>
                            <Th>Event Date</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                        employeeEvents?.data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                    No employee events found.
                                </td>
                            </tr>
                        ) : (
                            employeeEvents?.data?.map((event: EmployeeEvent) => (
                                <Tr key={event.id}>
                                    <Td  className="text-sm font-medium text-gray-700">{event.eventId}</Td>
                                    <Td  className="text-sm font-medium text-gray-700">{event.eventTitle}</Td>
                                    <Td  className="text-sm font-medium text-gray-700">{event.employeeFirstName} {event.employeeLastName}</Td>
                                    <Td  className="text-sm font-medium text-gray-700">{event.employeeEmailAddress}</Td>
                                    <Td  className="text-sm font-medium text-gray-700">{event.eventDate}</Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton as={Button} size="sm" variant="ghost">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem 
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    onEditModalOpen();
                                                }}
                                                className="text-sm font-medium text-gray-700">Edit</MenuItem>
                                                <MenuItem  
                                                className="text-sm font-medium text-gray-700" 
                                                color="red.500" 
                                                onClick={() => {
                                                    setDeletingEventId(event.eventId);
                                                    onDeleteModalOpen();
                                                }}>Delete</MenuItem>
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
        <AddEmployeeEvent 
        isOpen={isOpen} 
        onClose={onClose} 
        fetchingEvents={fetchingEmployeeEvents} 
        events={events?.data || []}
        employees={employees}
        />
        <EditEmployeeEvent 
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        fetchingEvents={fetchingEmployeeEvents}
        events={events?.data || []}
        employees={employees}
        selectedEvent={selectedEvent}
        />
        <DeleteModal 
        title="Delete Employee Event"
        isLoading={isLoading}
        isOpen={isDeleteModalOpen} 
        onClose={onDeleteModalClose} 
        confirmAction={handleDeleteEvent} 
        />
    </div>
  )
}

export default EmployeeEvents