import { Select } from "@chakra-ui/react"

interface PaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    pageSize: number;
    data: {
        item: any[];
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

const Pagination = ({currentPage, setCurrentPage, setPageSize, pageSize, data}: PaginationProps) => {

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
        if (!data) return [];

        const totalPages = data.totalPages;
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
    <div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * pageSize, data.item.length * data.totalPages)}
                        </span>{' '}
                        of <span className="font-medium">{data.item.length * data.totalPages}</span> results
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
                            disabled={!data.hasPreviousPage}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                !data.hasPreviousPage
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
                            disabled={!data.hasNextPage}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                !data.hasNextPage
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
    </div>
  )
}

export default Pagination