import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import request from "../utils/httpsRequest";
import { useUserAuthContext } from "../context/user/user.hook";

const Events = () => {

    const { token } = useUserAuthContext();
    const [events, setEvents] = useState([]);

    const fetchingEvents = async () => {
        try {
            const response = await request({token}).get('/Event');
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
            fetchingEvents();
        }
    }, [token]);

  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
            <Box mb={6}>
                <Text className="text-2xl font-bold mb-1">Events</Text>
                <Text className="text-gray-700 mb-6">Manage your events effectively.</Text>
            </Box>
            <TableContainer>
                <Table variant='simple' border={"1px solid #edf2f7"}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                        events.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                    No events found.
                                </td>
                            </tr>
                        ) : (
                            events?.map((event: any) => (
                                <Tr key={event.id}>
                                    <Td>{event.id}</Td>
                                    <Td>{event.name}</Td>
                                    <Td>{event.email}</Td>
                                </Tr>
                            ))
                        )
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </main>
    </div>
  )
}

export default Events