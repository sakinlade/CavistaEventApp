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
import type { Employee, EmployeeEventsResponse, Event, EventResponse } from '../utils/types';
import AddEmployeeEvent from '../components/AddEmployeeEvent';

const EmployeeEvents = () => {

    const { token } = useUserAuthContext();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [events, setEvents] = useState<EventResponse | null>(null);
    const [employeeEvents, setEmployeeEvents] = useState<EmployeeEventsResponse | null>(null);

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

    console.log('Events:', events); 

  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
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
                            <Th>Name</Th>
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
                            employeeEvents?.data?.map((event: Event) => (
                                <Tr key={event.id}>
                                    <Td  className="text-sm font-medium text-gray-700">{event.id}</Td>
                                    <Td  className="text-sm font-medium text-gray-700">{event.name}</Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton as={Button} size="sm" variant="ghost">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem className="text-sm font-medium text-gray-700">Edit</MenuItem>
                                                <MenuItem  
                                                className="text-sm font-medium text-gray-700" 
                                                color="red.500" 
                                                onClick={() => {
                                                    // setDeletingEventId(event.id);
                                                    // onDeleteModalOpen();
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
        {/* <AddEvent isOpen={isOpen} onClose={onClose} fetchingEvents={fetchingEvents} />
        <DeleteModal 
        title="Delete Event"
        isLoading={isLoading}
        isOpen={isDeleteModalOpen} 
        onClose={onDeleteModalClose} 
        confirmAction={handleDeleteEvent} 
        /> */}
    </div>
  )
}

export default EmployeeEvents