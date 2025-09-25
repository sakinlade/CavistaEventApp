import { 
    Button, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent,  
    ModalHeader, 
    ModalOverlay
} from '@chakra-ui/react';
import { ErrorMessage, Form, Formik } from 'formik';
import request from '../utils/httpsRequest';
import { useUserAuthContext } from '../context/user/user.hook';
import { AddUserSchema } from '../utils/validationSchema';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  refreshAction: () => void;
}

const AddUser = ({ isOpen, onClose, refreshAction }: AddUserProps) => {

    const { token } = useUserAuthContext();
    const [loading, setLoading] = useState(false);
    const initialValues = {
      userName: '',
      firstName: '',
      lastName: '',
      email: ''
    }
  
    const handleSubmit = async (values: typeof initialValues) => {
        setLoading(true)
      try {
        const response = await request({ token }).post('/api/Auth/AdminAddUsers', values);
        console.log(response.data);
        if (response && response.status === 200) {
          toast.success('Event added successfully!');
          refreshAction();
        }
      } catch (error: any) {
        setLoading(false);
        console.error('Failed to add event:', error);
        toast.error(error.response?.data?.errors[0] || 'Failed to add event. Please try again.');
      } finally {
        setLoading(false);
        onClose();
      }
    }

    return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add New User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Formik
            initialValues={initialValues}
            validationSchema={AddUserSchema}
            onSubmit={handleSubmit}
            >
            {({ isSubmitting, errors, touched, handleBlur, handleChange, values }) => {
                console.log(errors)
                return(
                <Form className="space-y-6">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                    User Name
                    </label>
                    <Input
                    id="userName"
                    name="userName"
                    type="text"
                    autoComplete="userName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.userName}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.userName && touched.userName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter your name"
                    />
                    <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                    />
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                    </label>
                    <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.firstName && touched.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter your first name"
                    />
                    <ErrorMessage
                    name="firstName"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                    </label>
                    <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.lastName && touched.lastName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter your last name"
                    />
                    <ErrorMessage
                    name="lastName"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                    </label>
                    <Input
                    id="email"
                    name="email"
                    autoComplete="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.email && touched.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter your email address"
                    />
                    <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                    />
                </div>
                <div className='mb-6'>
                    <Button
                    type="submit"
                    width="full"
                    bg={"red.600"}
                    color={"white"}
                    disabled={isSubmitting || loading}
                    >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
                </Form>
            )}}
            </Formik>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default AddUser