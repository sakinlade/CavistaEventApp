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
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter, 
    Input, 
    useDisclosure, 
    Flex,
    useColorModeValue, 
    Textarea, 
    Menu, 
    MenuButton, 
    MenuList, 
    MenuItem 
} from "@chakra-ui/react";
import { MdOutlineEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../context/user/user.hook";
import { UserAuthAction } from "../context/user/user-reducer";
import { jwtDecode } from "jwt-decode";

const mockEvents = [
  { id: 1, name: "Birthday Party", message: "Celebrate with friends!", status: "Active" },
  { id: 2, name: "Conference", message: "Tech talks and networking.", status: "Active" },
  { id: 3, name: "Wedding", message: "Join us for the big day.", status: "Inactive" },
];

const Events = () => {

    const navigate = useNavigate();
    const { token, dispatch } = useUserAuthContext();
    const [events, setEvents] = useState(mockEvents);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newEvent, setNewEvent] = useState({ name: "", message: "" });

    const [userName, setUserName] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
    if (!token) return;
    const decodedToken = jwtDecode<{ [key: string]: any }>(token);
    const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    setUserName(decodedToken[nameClaim]);
    setUserRole(decodedToken[roleClaim]);
    }, [token]);
    

    const handleAddEvent = () => {
        if (!newEvent.name || !newEvent.message) return;
        setEvents([
        ...events,
        { id: events.length + 1, name: newEvent.name, message: newEvent.message, status: "Active" },
        ]);
        setNewEvent({ name: "", message: "" });
        onClose();
    };

    const handleLogout = () => {
      localStorage.removeItem('authToken');
      dispatch({ type: UserAuthAction.LOG_OUT as keyof typeof UserAuthAction });
      navigate('/');
    }

  return (
    <Box 
    minH="100vh" 
    // bgGradient="linear(to-br, #f8fafc, #f87171, #fff)" 
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
      <Box maxW="900px" mx="auto" mt={10} p={8} bg="white" borderRadius="2xl" boxShadow="lg">
        <Flex mb={8} justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="red.500">My Events</Text>
          <Button colorScheme="red" size="md" borderRadius="full" px={6} onClick={onOpen} boxShadow="md">
            + Add Event
          </Button>
        </Flex>
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
            {events.length === 0 ? (
              <Tr>
                <Td colSpan={4} textAlign="center">No events found.</Td>
              </Tr>
            ) : (
              events.map((event, idx) => (
                <Tr key={event.id} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="medium">{idx + 1}</Td>
                  <Td>{event.name}</Td>
                  <Td maxW="200px" isTruncated>{event.message}</Td>
                  <Td>
                    <Badge px={3} py={1} borderRadius="full" colorScheme={event.status === "Active" ? "green" : "gray"} fontSize="sm">
                      {event.status}
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
                            <MenuItem gap={2} fontSize={"sm"} color={"gray.600"}>
                                <MdOutlineEdit className='w-5' />
                                Edit
                            </MenuItem>
                            <MenuItem gap={2} fontSize={"sm"} color={"red.500"}>
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
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent borderRadius="2xl">
            <ModalHeader fontWeight="bold" color="red.500">Add New Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Event Name"
                mb={4}
                value={newEvent.name}
                onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                size="lg"
                borderRadius="xl"
                focusBorderColor="red.400"
              />
              <Textarea
                placeholder="Event Message"
                value={newEvent.message}
                onChange={e => setNewEvent({ ...newEvent, message: e.target.value })}
                size="lg"
                borderRadius="xl"
                focusBorderColor="red.400"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleAddEvent} borderRadius="full" px={6}>Add</Button>
              <Button variant="ghost" onClick={onClose} borderRadius="full">Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default Events