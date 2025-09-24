import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { 
    Badge,
    Box, 
    Button,
    Input, 
    InputGroup, 
    InputLeftElement, 
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
import Pagination from '../components/Pagination';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import { GoTrash } from 'react-icons/go';
import ApprovalModal from '../components/ApprovalModal';

const EmployeeEvents = () => {

    const { token } = useUserAuthContext();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [events, setEvents] = useState<EventResponse | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EmployeeEvent | null>(null);
    const [employeeEvents, setEmployeeEvents] = useState<EmployeeEventsResponse | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<number>();
    const { isOpen: isDeleteModalOpen, onClose: onDeleteModalClose, onOpen: onDeleteModalOpen } = useDisclosure();
    const { isOpen: isEditModalOpen, onClose: onEditModalClose, onOpen: onEditModalOpen } = useDisclosure();
    const { isOpen: isApprovalModalOpen, onClose: onApprovalModalClose, onOpen: onApprovalModalOpen } = useDisclosure();

    const fetchingEmployeeEvents = async () => {
        setLoading(true);
        try {
            const response = await request({token}).get(`/api/EmployeeEvents?index=${currentPage}&pageSize=${pageSize}&searchString=${searchTerm}`);
            if (response && response.status === 200) {
                setEmployeeEvents(response.data);
            }
        } catch (error) {
            setLoading(false);
            console.error('Failed to fetch events:', error);
            toast.error('Failed to fetch events. Please try again.');
        } finally {
            setLoading(false);
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
                setEmployees(response.data?.item);
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
    }, [token, currentPage, pageSize]);

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

    const handleSearch = () => {
        setCurrentPage(1);
        fetchingEmployeeEvents();
    }

  return (
    <div className="flex min-h-screen">
        <div className="fixed left-0 top-0 h-screen w-64 z-20 bg-white shadow-lg">
            <Sidebar />
        </div>
        <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
            <Box mb={6}>
                <Text className="text-2xl font-bold mb-1">Employee Events</Text>
                <Text className="text-gray-700 mb-6">Manage your events effectively.</Text> 
            </Box>
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </InputLeftElement>
                            <Input
                                placeholder="Search events..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </InputGroup>
                    </div>
                    <Button 
                        colorScheme="red" 
                        onClick={handleSearch}
                        isLoading={isLoading || loading}
                    >
                        Search
                    </Button>
                    <Button 
                        onClick={onOpen}
                        variant="outline" 
                        border={"1px solid red"}
                        color={"red.500"}
                        leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        }
                    >
                        Add Employee Event
                    </Button>
                </div>
            </div>
            <TableContainer>
                <Table variant='simple' border={"1px solid #edf2f7"}>
                    <Thead>
                        <Tr>
                            <Th>Employee Name</Th>
                            <Th>Event Name</Th>
                            <Th>Employee Email</Th>
                            <Th>Event Date</Th>
                            <Th>Status</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                        loading ? (
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
                        employeeEvents?.item.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                    No employee events found.
                                </td>
                            </tr>
                        ) : (
                            employeeEvents?.item?.map((event: EmployeeEvent, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase">
                                                {event.employeeFirstName?.charAt(0)}{event.employeeLastName?.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {event.employeeFirstName} {event.employeeLastName}
                                                </div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td className="text-sm font-medium text-gray-700">{event.eventTitle}</Td>
                                    <Td className="text-sm font-medium text-gray-700">{event.employeeEmailAddress}</Td>
                                    <Td className="text-sm font-medium text-gray-700">{event.eventDate}</Td>
                                    <Td className="text-sm font-medium text-gray-700">
                                        <Badge colorScheme={event.status === "Approved" ? "green" : "yellow"}>{event.status}</Badge>
                                    </Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton as={Button} size="sm" variant="ghost">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </MenuButton>
                                            <MenuList>
                                                {
                                                    !event.isApproved && (
                                                        <MenuItem 
                                                        onClick={() => {
                                                            setSelectedEvent(event);
                                                            onApprovalModalOpen();
                                                        }}
                                                        className="text-sm font-medium text-gray-700">
                                                            <FaCheck className='w-4 h-4 text-gray-500 mr-2'/>
                                                            Approve Event
                                                        </MenuItem>
                                                    )
                                                }
                                                <MenuItem 
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    onEditModalOpen();
                                                }}
                                                className="text-sm font-medium text-gray-700">
                                                    <MdOutlineEdit className='w-4 h-4 mr-2'/>
                                                    Edit Event
                                                </MenuItem>
                                                <MenuItem  
                                                className="text-sm font-medium text-gray-700" 
                                                color="red.500" 
                                                onClick={() => {
                                                    setDeletingEventId(event.eventId);
                                                    onDeleteModalOpen();
                                                }}>
                                                    <GoTrash className='w-4 h-4 text-red-500 mr-2'/>
                                                    Delete Event
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
            {/* Pagination */}
            {employeeEvents && employeeEvents?.totalPages > 0 && (
                <Pagination 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                data={employeeEvents}
                />
            )}
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
        <ApprovalModal 
        isOpen={isApprovalModalOpen}
        onClose={onApprovalModalClose}
        fetchingEvents={fetchingEmployeeEvents}
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