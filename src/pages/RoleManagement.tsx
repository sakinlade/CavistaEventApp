import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Sidebar from "../components/Sidebar"
import { useUserAuthContext } from "../context/user/user.hook";
import { useEffect, useState } from "react";
import request from "../utils/httpsRequest";
import toast from "react-hot-toast";

const RoleManagement = () => {

    const { token } = useUserAuthContext();
    const [roles, setRoles] = useState([]);

    const fetchingRoles = async () => {
        try {
            const response = await request({token}).get('/api/Auth/GetRoles');
            if (response && response.status === 200) {
                setRoles(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            toast.error('Failed to fetch roles. Please try again.');
        }
    }

    useEffect(() => {
        if (token) {
            fetchingRoles();
        }
    }, [token]);

  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
            <Box mb={6}>
                <Text className="text-2xl font-bold mb-1">Role Management</Text>
                <Text className="text-gray-700 mb-6">Manage user roles and permissions.</Text>
            </Box>
            <TableContainer>
                <Table variant='simple' border={"1px solid #edf2f7"}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                        roles.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                    No roles found.
                                </td>
                            </tr>
                        ) : (
                            roles?.map((role: any) => (
                                <Tr key={role.id}>
                                    <Td>{role.id}</Td>
                                    <Td>{role.name}</Td>
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

export default RoleManagement