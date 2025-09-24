import { Text, Skeleton, SkeletonText, SkeletonCircle, Box, Stack, Flex } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../utils/httpsRequest';
import { useUserAuthContext } from '../context/user/user.hook';
import toast from 'react-hot-toast';

// Mock data for recent activities
const recentActivities = [
    { id: 1, user: "Alex Johnson", action: "added a new employee", time: "2 hours ago" },
    { id: 2, user: "Maria Garcia", action: "updated event details", time: "Yesterday" },
    { id: 3, user: "Sam Lee", action: "modified role permissions", time: "2 days ago" },
    { id: 4, user: "Taylor Swift", action: "bulk uploaded 15 employees", time: "3 days ago" }
];

const Dashboard = () => {

    const navigate = useNavigate();
    const { token } = useUserAuthContext();
    const [stats, setStats] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);

    const fetchingEvents = async () => {
        setIsLoading(true);
        try {
            const response = await request({token}).get('/api/Home');
            if (response && response.status === 200) {
                setStats(response.data);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to fetch events:', error);
            toast.error('Failed to fetch events. Please try again.');
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchingEvents();
        }
    }, [token]);

    return (
        <div className="flex min-h-screen">
            <div className="fixed left-0 top-0 h-screen w-64 z-20 bg-white shadow-lg">
                <Sidebar />
            </div>
            <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
                <div className="mb-8">
                    <Text className="text-3xl font-bold text-gray-800">Dashboard Overview</Text>
                    <Text className="text-gray-600 mt-1">Welcome to your staff celebration dashboard</Text>
                </div>
                {
                    isLoading ? (
                        <Stack spacing={8}>
                            {/* Stats Cards Skeleton */}
                            <Flex gap={6} mb={8} wrap="wrap">
                                {["red.500", "blue.500", "green.500", "purple.500"].map((color, idx) => (
                                    <Box key={idx} bg="white" rounded="lg" shadow="sm" p={6} borderLeftWidth={4} borderLeftColor={color} flex="1 1 220px">
                                        <Flex align="center">
                                            <SkeletonCircle size="12" mr={4} />
                                            <Box>
                                                <SkeletonText noOfLines={2} spacing={2} skeletonHeight={4} width="100px" />
                                            </Box>
                                        </Flex>
                                    </Box>
                                ))}
                            </Flex>
                            {/* Upcoming Events & Recent Activities Skeleton */}
                            <Flex gap={6} wrap="wrap">
                                <Box flex="2" bg="white" rounded="lg" shadow="sm">
                                    <Box borderBottomWidth={1} px={6} py={4}>
                                        <Skeleton height="24px" width="180px" />
                                    </Box>
                                    <Box p={6}>
                                        <Skeleton height="32px" mb={4} />
                                        <Stack>
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} height="24px" mb={2} />
                                            ))}
                                        </Stack>
                                        <Flex justify="center" mt={4}>
                                            <Skeleton height="20px" width="120px" />
                                        </Flex>
                                    </Box>
                                </Box>
                                <Box flex="1" bg="white" rounded="lg" shadow="sm">
                                    <Box borderBottomWidth={1} px={6} py={4}>
                                        <Skeleton height="24px" width="160px" />
                                    </Box>
                                    <Box p={6}>
                                        <Stack>
                                            {[...Array(4)].map((_, i) => (
                                                <Flex key={i} align="center" mb={4}>
                                                    <SkeletonCircle size="10" mr={4} />
                                                    <Box flex="1">
                                                        <Skeleton height="16px" mb={2} />
                                                        <Skeleton height="12px" width="80px" />
                                                    </Box>
                                                </Flex>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            </Flex>
                        </Stack>
                    ) : (        
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Box borderLeftWidth={4} borderLeftColor={"red.500"} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase">Total Employees</p>
                                            <p className="text-2xl font-semibold text-gray-800">{stats?.numberOfEmployees}</p>
                                        </div>
                                    </div>
                                </Box>
                                
                                <Box  borderLeftWidth={4} borderLeftColor={"blue.500"} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase">Upcoming Events</p>
                                            <p className="text-2xl font-semibold text-gray-800">{stats?.numberOfEventsForTheMonth}</p>
                                        </div>
                                    </div>
                                </Box>

                                <Box borderLeftWidth={4} borderLeftColor={"green.500"} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase">Birthdays This Month</p>
                                            <p className="text-2xl font-semibold text-gray-800">{stats?.numberOfBirthDaysForTheMonth || 0}</p>
                                        </div>
                                    </div>
                                </Box>

                                <Box borderLeftWidth={4} borderLeftColor={"purple.500"} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase">Work Anniversaries</p>
                                            <p className="text-2xl font-semibold text-gray-800">{stats?.numberOfWorkAnniversaryForTheMonth || 0}</p>
                                        </div>
                                    </div>
                                </Box>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Upcoming Events Section */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
                                    <div className="border-b px-6 py-4 space-y-2">
                                        <Text className="text-lg font-semibold text-gray-800">Upcoming Events</Text>
                                        <Text className="text-sm font-medium text-gray-700">List of upcoming event this week</Text>
                                    </div>
                                    <div className="p-6">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celebrant</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {stats?.eventsForTheWeek?.map((event: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event?.employeeFirstName} {event?.employeeLastName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.eventDate}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                {event.eventTitle}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="mt-4 flex justify-center">
                                            <button onClick={() => navigate('/employee-events')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                                                View all events →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Recent Activities Section */}
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="border-b px-6 py-4">
                                        <Text className="text-lg font-semibold text-gray-800">Recent Activities</Text>
                                    </div>
                                    <div className="p-6">
                                        <div className="flow-root">
                                            <ul className="-mb-8">
                                                {recentActivities.map((activity, index) => (
                                                    <li key={activity.id}>
                                                        <div className="relative pb-8">
                                                            {index !== recentActivities.length - 1 ? (
                                                                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                            ) : null}
                                                            <div className="relative flex items-start space-x-3">
                                                                <div className="relative">
                                                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                                        <span className="text-red-600 font-medium text-sm">
                                                                            {activity.user.split(' ').map(name => name[0]).join('')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div>
                                                                        <div className="text-sm">
                                                                            <span className="font-medium text-gray-900">{activity.user}</span>
                                                                            <span className="ml-1 text-gray-500">{activity.action}</span>
                                                                        </div>
                                                                        <p className="mt-0.5 text-sm text-gray-500">{activity.time}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </main>
        </div>
    );
};

export default Dashboard;