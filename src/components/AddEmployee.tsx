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
import { EmployeeSchema } from '../utils/validationSchema';
import toast from 'react-hot-toast';

interface AddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  fetchingEmployees: () => void;
}

const AddEmployee = ({ isOpen, onClose, fetchingEmployees }: AddEmployeeProps) => {

    const { token } = useUserAuthContext();
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
    }

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const response = await request({ token }).post('/api/Employeess', values);
            if (response && response.status === 201) {
                toast.success('Employee added successfully!');
                fetchingEmployees();
                onClose();
            }
        } catch (error) {
            console.error('Failed to add employee:', error);
            toast.error('Failed to add employee. Please try again.');
        }
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
            initialValues={initialValues}
            validationSchema={EmployeeSchema}
            onSubmit={handleSubmit}
            >
            {({ isSubmitting, errors, touched, handleBlur, handleChange, values }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.email && touched.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
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
                    type="text"
                    autoComplete="given-name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.firstName && touched.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
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
                    type="text"
                    autoComplete="given-name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.lastName && touched.lastName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter your last name"
                  />
                  <ErrorMessage
                    name="lastName"
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default AddEmployee