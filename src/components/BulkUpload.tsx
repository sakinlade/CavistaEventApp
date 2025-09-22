import { useState, useRef } from 'react';
import request from '../utils/httpsRequest';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Box, Button } from '@chakra-ui/react';
import { useUserAuthContext } from '../context/user/user.hook';

interface BulkUploadProps {
  isOpen: boolean;
  onClose: () => void;
  fetchingEmployees: () => void;
}

const BulkUpload = ({ isOpen, onClose, fetchingEmployees }: BulkUploadProps) => {
  const { token } = useUserAuthContext();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setUploadStatus('idle');
      } else {
        setErrorMessage('Please upload a CSV file');
        setUploadStatus('error');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file to upload');
      setUploadStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadStatus('idle');
      const response = await request({ token, contentType: 'multipart/form-data' }).post('/api/Employees/BulkUpload', formData);
      if (response && response.status === 200) {
        setUploadStatus('success');
        fetchingEmployees();
        setTimeout(() => {
          onClose();
          setFile(null);
          setUploadStatus('idle');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Failed to upload file:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to upload file. Please try again.');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="bg-red-50 text-red-500 rounded-t-md">
          Bulk Upload Employees
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody className="p-6">
          <div className="space-y-4">
            <Box 
                border={"2px dashed #b6bdc5"}
                mt={4}
              className={`border-2 border-dashed rounded-md p-8 text-center ${
                isDragging ? 'border-gray-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
              } transition-all cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <p className="text-gray-700 font-medium">
                  {file ? file.name : 'Drag & drop your CSV file here or click to browse'}
                </p>
                
                <p className="text-sm text-gray-500">
                  Only CSV files are supported
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </Box>

            {uploadStatus === 'error' && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                File uploaded successfully!
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            colorScheme="red"
          >
            {uploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkUpload;