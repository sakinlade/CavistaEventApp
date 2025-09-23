import Sidebar from '../components/Sidebar'
import { 
    Box, 
    Text,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure
} from '@chakra-ui/react'
import { useUserAuthContext } from '../context/user/user.hook';
import { useEffect, useState } from 'react';
import request from '../utils/httpsRequest';
import toast from 'react-hot-toast';
import { LuUserRoundPen } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import type { Role } from '../utils/types';
import EditRole from '../components/EditRole';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    phoneNumber: string;
    isActive?: boolean;
}

interface UserResponse {
    item: User[];
    pageIndex: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const UserManagement = () => {
    const { token } = useUserAuthContext();
    const [users, setUsers] = useState<UserResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const { isOpen: isEditRoleOpen, onOpen: onEditRoleOpen, onClose: onEditRoleClose } = useDisclosure();

    const fetchUsers = async (page: number = 1, size: number = 10, search: string = '') => {
        setIsLoading(true);
        try {
            const response = await request({token}).get(`/api/Auth/GetUsers?pageIndex=${page}&pageSize=${size}&searchString=${search}`);
            if (response && response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to fetch users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

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
            fetchUsers(currentPage, pageSize, searchTerm);
            fetchingRoles();
        }
    }, [token, currentPage, pageSize]);

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page when searching
        fetchUsers(1, pageSize, searchTerm);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    }

    // Generate page numbers
    const getPageNumbers = () => {
        if (!users) return [];
        
        const totalPages = users.totalPages;
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        // Always show first, last, and pages around current
        let pages: (number | string)[] = [];
        
        if (currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
        
        return pages;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6">
                <Box mb={6}>
                    <Text className="text-2xl font-bold mb-1">User Management</Text>
                    <Text className="text-gray-600 mb-6">Manage users and their permissions</Text>
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
                                    placeholder="Search users..." 
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
                        <Button 
                            variant="outline" 
                            leftIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            }
                        >
                            Add User
                        </Button>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Loading users...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users?.item?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users?.item?.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.userName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.phoneNumber || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge colorScheme={user.isActive !== false ? "green" : "red"} variant="subtle">
                                                    {user.isActive !== false ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Menu>
                                                    <MenuButton as={Button} size="sm" variant="ghost">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </MenuButton>
                                                    <MenuList>
                                                        <MenuItem
                                                        onClick={() => {
                                                            setSelectedUserId(user.id);
                                                            onEditRoleOpen();
                                                        }}
                                                        gap={2} fontSize={"sm"} color={"gray.600"}>
                                                            <LuUserRoundPen className='w-5' />
                                                            Change Role
                                                        </MenuItem>
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
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users && users.totalPages > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * pageSize, users.item.length * users.totalPages)}
                                        </span>{' '}
                                        of <span className="font-medium">{users.item.length * users.totalPages}</span> results
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Select
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        size="sm"
                                        className="w-20"
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </Select>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!users.hasPreviousPage}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                                !users.hasPreviousPage 
                                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {getPageNumbers().map((page, index) => (
                                            typeof page === 'number' ? (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border ${
                                                        currentPage === page
                                                            ? 'z-10 bg-red-50 border-red-500 text-red-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ) : (
                                                <span key={index} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
                                                    {page}
                                                </span>
                                            )
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!users.hasNextPage}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                                !users.hasNextPage 
                                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <EditRole 
            isOpen={isEditRoleOpen} 
            onClose={onEditRoleClose} 
            roles={roles} 
            refetching={fetchUsers} 
            selectedUserId={selectedUserId}
            />
        </div>
    )
}

export default UserManagement