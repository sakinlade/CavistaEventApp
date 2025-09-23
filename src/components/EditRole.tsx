import { 
    Button, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent,  
    ModalHeader, 
    ModalOverlay, 
    Select
} from '@chakra-ui/react';
import { ErrorMessage, Form, Formik } from 'formik';
import request from '../utils/httpsRequest';
import { useUserAuthContext } from '../context/user/user.hook';
import { ChangeRoleSchema } from '../utils/validationSchema';
import toast from 'react-hot-toast';
import type { Role } from '../utils/types';

interface EditRoleProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  refetching: () => void;
  selectedUserId: string | null;
}

const EditRole = ({ isOpen, onClose, refetching, selectedUserId, roles }: EditRoleProps) => {
    const { token } = useUserAuthContext();
    const initialValues = {
       role: '',
    }

    const handleSubmit = async (values: typeof initialValues) => {
        try {
          const response = await request({ token }).post(`/api/Auth/ChangeUserRole/${selectedUserId}`, values);
          if (response && response.status === 200) {
            toast.success('Role changed successfully!');
            refetching();
            onClose();
          }
        } catch (error) {
          console.error('Failed to change role:', error);
          toast.error('Failed to change role. Please try again.');
        }
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Change User Role</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Formik
            initialValues={initialValues}
            validationSchema={ChangeRoleSchema}
            onSubmit={handleSubmit}
            >
            {({ isSubmitting, errors, touched, handleBlur, handleChange, values }) => (
                <Form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                    </label>
                    <Select
                    id="role"
                    name="role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.role}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.role && touched.role
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Select role"
                    >
                        {
                            roles?.map((role) => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))
                        }
                    </Select>
                    <ErrorMessage
                    name="role"
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
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default EditRole