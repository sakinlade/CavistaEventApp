import { useEffect, useState } from "react";
import { 
    Box, 
    Button, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    Text, 
    Badge,
    useDisclosure, 
    Flex,
    useColorModeValue,
    Menu, 
    MenuButton, 
    MenuList, 
    MenuItem, 
    InputGroup,
    InputLeftElement,
    Input
} from "@chakra-ui/react";
import { MdOutlineEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../context/user/user.hook";
import { UserAuthAction } from "../context/user/user-reducer";
import { jwtDecode } from "jwt-decode";
import request from "../utils/httpsRequest";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";
import AddStaffEvent from "../components/AddStaffEvent";
import type { EmployeeEvent, EmployeeEventsResponse, EventResponse } from "../utils/types";
import EditStaffEvent from "../components/EditStaffEvent";
import DeleteModal from "../components/DeleteModal";

// 019967ec-0a5c-77f0-83a8-4a546161c95c
const Events = () => {

    const navigate = useNavigate();
    const { token, dispatch } = useUserAuthContext();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingEventId, setDeletingEventId] = useState<number>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [employeeId, setEmployeeId] = useState<string>("");
    const [events, setEvents] = useState<EventResponse | null>(null);
    const [employeeEvents, setEmployeeEvents] = useState<EmployeeEventsResponse | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<null | EmployeeEvent>(null);

    const [userName, setUserName] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        if (!token) return;
        const decodedToken = jwtDecode<{ [key: string]: any }>(token);
        setEmployeeId(decodedToken.id);
        const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        setUserName(decodedToken[nameClaim]);
        setUserRole(decodedToken[roleClaim]);
    }, [token]);

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

    useEffect(() => {
        if (token) {
            fetchingEmployeeEvents();
            fetchingEvents();
        }
    }, [token, currentPage, pageSize]);


    const handleLogout = () => {
      localStorage.removeItem('authToken');
      dispatch({ type: UserAuthAction.LOG_OUT as keyof typeof UserAuthAction });
      navigate('/');
    }

    const handleSearch = () => {
        setCurrentPage(1);
        fetchingEmployeeEvents();
    }

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
    <Box 
    minH="100vh" 
    bg={useColorModeValue("gray.50", "gray.800")}
    pb={10}>
      <Flex as="nav" align="center" justify="space-between" px={8} py={4} bg="white" boxShadow="sm">
        <Flex align="center" gap={2}>
          <img src="/vite.svg" alt="Logo" style={{ width: 36, height: 36 }} />
          <Text fontWeight="bold" fontSize="xl" color="red.500">Spark Hub</Text>
        </Flex>
        <Flex align={"end"}>
            <Flex gap={3} align="center" mr={3}>
                <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="font-medium text-sm uppercase text-white">{userName.charAt(0)}</span>
                    <span className="font-medium text-sm uppercase text-white">{userName.charAt(1)}</span>
                </div>
                <Box>
                    <Text fontWeight="medium" textTransform={"uppercase"} fontSize={"14px"} color="gray.700">{userName}</Text>
                    <Text fontWeight="medium" textTransform={"lowercase"} fontSize={"14px"} color="gray.600">{userRole}</Text>
                </Box>
            </Flex>
            <Menu>
              <MenuButton as={Box} cursor="pointer">
                <ChevronDownIcon className="w-6 h-6 text-gray-500 -mt-4" />
            </MenuButton>
            <MenuList>
                <MenuItem onClick={() => {handleLogout()}}>Logout</MenuItem>
              </MenuList>
            </Menu>
        </Flex>
      </Flex>
      {/* Main Content */}
        <Box maxW="6xl" mx="auto" mt={6}>
            <Text fontSize="2xl" fontWeight="bold" color="red.500" mb={5}>My Events</Text>
            <Box border={"1px solid"} borderColor={useColorModeValue("gray.200", "gray.700")} borderRadius="lg" p={6} bg={useColorModeValue("white", "gray.700")}>
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
                            isLoading={loading}
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
                            Add New Event
                        </Button>
                    </div>
                </div>
                <Box bg={"white"}>
                    <Table variant="simple" size="md">
                    <Thead bg="gray.50">
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
                        <Tr>
                            <Td colSpan={4} textAlign="center">No events found.</Td>
                        </Tr>
                        ) : (
                        employeeEvents?.item.map((event) => (
                            <Tr key={event.id} _hover={{ bg: "gray.50" }}>
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
                                            <MenuItem 
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                onEditModalOpen();
                                            }}
                                            gap={2} fontSize={"sm"} color={"gray.600"}>
                                                <MdOutlineEdit className='w-5' />
                                                Edit
                                            </MenuItem>
                                            <MenuItem 
                                            onClick={() => {
                                                setDeletingEventId(event.id);
                                                onDeleteModalOpen();
                                            }}
                                            gap={2} fontSize={"sm"} color={"red.500"}>
                                                <GoTrash className='w-5' />
                                                Delete
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        ))
                        )}
                    </Tbody>
                    </Table>
                    {employeeEvents && employeeEvents?.totalPages > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            data={employeeEvents}
                        />
                    )}
                </Box>
            </Box>
            <AddStaffEvent
                isOpen={isOpen} 
                onClose={onClose} 
                fetchingEvents={fetchingEmployeeEvents} 
                events={events?.data || []}
                employeeId={employeeId}
            />
            <EditStaffEvent
                isOpen={isEditModalOpen}
                onClose={onEditModalClose}
                fetchingEvents={fetchingEmployeeEvents}
                events={events?.data || []}
                selectedEvent={selectedEvent}
            />  
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                isLoading={isLoading}
                title="Delete Event"
                confirmAction={handleDeleteEvent}
            />
      </Box>
    </Box>
  );
}

export default Events;