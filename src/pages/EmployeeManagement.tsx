import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"
import { useUserAuthContext } from "../context/user/user.hook";
import request from "../utils/httpsRequest";
import type { Employee, EmployeeResponse } from "../utils/types";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Badge,
} from '@chakra-ui/react'
import AddEmployee from "../components/AddEmployee";
import BulkUpload from "../components/BulkUpload";
import { MdOutlineEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import DeleteModal from "../components/DeleteModal";
import EditEmployee from "../components/EditEmployee";
import Pagination from "../components/Pagination";

const EmployeeManagement = () => {

    const { token } = useUserAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<EmployeeResponse | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<number>();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const { isOpen: isEditModalOpen, onClose: onEditModalClose, onOpen: onEditModalOpen } = useDisclosure();
    const { isOpen: isBulkUploadOpen, onClose: onBulkUploadClose, onOpen: onBulkUploadOpen } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onClose: onDeleteModalClose, onOpen: onDeleteModalOpen } = useDisclosure();

    const fetchingEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await request({token}).get(`/api/Employees?index=${currentPage}&pageSize=${pageSize}&searchString=${searchTerm}`);
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
    }, [token, currentPage, pageSize]);

    const handleDelete = async () => {
        if(!deletingUserId) return;
        setIsLoading(true);
        try {
            const response = await request({ token }).delete(`/api/Employees/${deletingUserId}`);
            if (response && response.status === 200) {
                fetchingEmployees();
                onDeleteModalClose();
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to delete employee:', error);
        } finally {
            setIsLoading(false);
        }
    }  

     const handleSearch = () => {
        setCurrentPage(1);
        fetchingEmployees();
    }


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
                            placeholder="Search employee..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </InputGroup>
                </div>
                <Button 
                    colorScheme="red" 
                    onClick={handleSearch}
                    isLoading={isLoading}
                >
                    Search
                </Button>
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
        </div>
        <TableContainer>
            <Table variant='simple' border={"1px solid #edf2f7"}>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
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
                                    <span>Loading employee...</span>
                                </div>
                            </td>
                        </tr>
                    ) : 
                    employees?.item?.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                                No employees found.
                            </td>
                        </tr>
                    ) : (
                        employees?.item?.map((employee) => (
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
                                <Td className="text-sm font-medium text-gray-700">
                                    <Badge colorScheme={"green"} variant="subtle">
                                        Active
                                    </Badge>
                                </Td>
                                <Td className="text-sm font-medium text-gray-700">
                                    <Menu>
                                        <MenuButton as={Button} size="sm" variant="ghost">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem 
                                            onClick={() => {
                                                setSelectedEmployee(employee);
                                                onEditModalOpen();
                                            }}
                                            gap={2} fontSize={"sm"} color={"gray.600"}>
                                                <MdOutlineEdit className='w-5' />
                                                Edit
                                            </MenuItem>
                                            <MenuItem 
                                            onClick={() => {
                                                setDeletingUserId(employee.id);
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
                    )
                    }
                </Tbody>
            </Table>
        </TableContainer>
        {employees && employees?.totalPages > 0 && (
            <Pagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
            data={employees}
            />
        )}
        <AddEmployee isOpen={isOpen} onClose={onClose} fetchingEmployees={fetchingEmployees} />
        <BulkUpload isOpen={isBulkUploadOpen} onClose={onBulkUploadClose} fetchingEmployees={fetchingEmployees} />
        <EditEmployee 
          isOpen={isEditModalOpen} 
          onClose={onEditModalClose} 
          employee={selectedEmployee} 
          fetchingEmployees={fetchingEmployees} 
        />
        <DeleteModal 
            title="Delete Employee"
            isOpen={isDeleteModalOpen} 
            onClose={onDeleteModalClose} 
            confirmAction={handleDelete} 
            isLoading={isLoading}
        />
      </main>
    </div>
  )
}

export default EmployeeManagement