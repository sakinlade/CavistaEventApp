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
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isBulkUploadOpen, onClose: onBulkUploadClose, onOpen: onBulkUploadOpen } = useDisclosure();
    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchingEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await request({token}).get('/api/Employees');
            if (response && response.status === 200) {
                setEmployees(response.data);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to fetch employees:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {  
        if (token) {
            fetchingEmployees();
        }
    }, [token]);
    
  return (
    <div className="flex min-h-screen">
      <div className="fixed left-0 top-0 h-screen w-64 z-20 bg-white shadow-lg">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        <Box mb={6}>
          <Text className="text-2xl font-bold mb-1">Employee Management</Text>
          <Text className="text-gray-700 mb-6">Manage your employees effectively.</Text>
        </Box>
        <div className="flex items-center justify-between mb-5">
            <div className="">
                <Input type="text" placeholder="Search employees..." w={"400px"}/>
            </div>
            <div className="flex items-center gap-2">
                <Button 
                isLoading={isLoading}
                border={"1px solid red"} bg={"white"} color="red.500" onClick={onBulkUploadOpen}>
                    Bulk Upload
                </Button>
                <Button 
                isLoading={isLoading}
                bg="red.500" color="white" onClick={onOpen}>
                    Add Employee
                </Button>
            </div>
        </div>
        <TableContainer>
            <Table variant='simple' border={"1px solid #edf2f7"}>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>ID</Th>
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
                                    <span>Loading employee...</span>
                                </div>
                            </td>
                        </tr>
                    ) : 
                    employees.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                No employees found.
                            </td>
                        </tr>
                    ) : (
                        employees.map((employee) => (
                            <Tr key={employee.id}>
                                <Td>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase">
                                            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {employee.firstName} {employee.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </Td>
                                <Td className="text-sm font-medium text-gray-700">{employee.emailAddress}</Td>
                                <Td className="text-sm font-medium text-gray-700">{employee.id}</Td>
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