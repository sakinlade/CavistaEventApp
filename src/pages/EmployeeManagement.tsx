import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"
import { useUserAuthContext } from "../context/user/user.hook";
import request from "../utils/httpsRequest";
import type { Employee } from "../utils/types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Text,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import AddEmployee from "../components/AddEmployee";
import BulkUpload from "../components/BulkUpload";

const EmployeeManagement = () => {

    const { token } = useUserAuthContext();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isBulkUploadOpen, onClose: onBulkUploadClose, onOpen: onBulkUploadOpen } = useDisclosure();
    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchingEmployees = async () => {
        try {
            const response = await request({token}).get('/api/Employeess');
            if (response && response.status === 200) {
                setEmployees(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    }

    useEffect(() => {  
        if (token) {
            fetchingEmployees();
        }
    }, [token]);

    console.log('Employees:', employees);
    
  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
            <Box mb={6}>
                <Text className="text-2xl font-bold mb-1">Employee Management</Text>
                <Text className="text-gray-700 mb-6">Manage your employees effectively.</Text>
            </Box>
            <div className="flex items-center justify-between mb-5">
                <div className="">
                    <Input type="text" placeholder="Search employees..." />
                </div>
                <div className="flex items-center gap-2">
                    <Button border={"1px solid red"} bg={"white"} color="red.500" onClick={onBulkUploadOpen}>
                        Bulk Upload
                    </Button>
                    <Button bg="red.500" color="white" onClick={onOpen}>
                        Add Employee
                    </Button>
                </div>
            </div>
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
                        employees.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            employees.map((employee) => (
                                <Tr key={employee.id}>
                                    <Td>{employee.id}</Td>
                                    <Td>{employee.name}</Td>
                                    <Td>{employee.email}</Td>
                                </Tr>
                            ))
                        )
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            <AddEmployee isOpen={isOpen} onClose={onClose} fetchingEmployees={fetchingEmployees} />
            <BulkUpload isOpen={isBulkUploadOpen} onClose={onBulkUploadClose} fetchingEmployees={fetchingEmployees} />
        </main>
    </div>
  )
}

export default EmployeeManagement