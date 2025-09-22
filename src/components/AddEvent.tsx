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
import { EventSchema } from '../utils/validationSchema';
import toast from 'react-hot-toast';

interface AddEventProps {
  isOpen: boolean;
  onClose: () => void;
  fetchingEvents: () => void;
}

const AddEvent = ({ isOpen, onClose, fetchingEvents }: AddEventProps) => {

    const { token } = useUserAuthContext();
    const initialValues = {
       name: '',
    }

    const handleSubmit = async (values: typeof initialValues) => {
        try {
          const response = await request({ token }).post('/api/Events', values.name);
          if (response && response.status === 200) {
            toast.success('Event added successfully!');
            fetchingEvents();
            onClose();
          }
        } catch (error) {
          console.error('Failed to add event:', error);
          toast.error('Failed to add event. Please try again.');
        }
    }

  return (
     <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Formik
            initialValues={initialValues}
            validationSchema={EventSchema}
            onSubmit={handleSubmit}
            >
            {({ isSubmitting, errors, touched, handleBlur, handleChange, values }) => (
                <Form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                    </label>
                    <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.name && touched.name
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

export default AddEvent