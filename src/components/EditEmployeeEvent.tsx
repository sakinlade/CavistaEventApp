import { 
    Button, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent,  
    ModalHeader, 
    ModalOverlay, 
    Select
} from '@chakra-ui/react';
import type { Employee, EmployeeEvent, Event } from '../utils/types';
import { ErrorMessage, Form, Formik } from 'formik';
import { useUserAuthContext } from '../context/user/user.hook';
import request from '../utils/httpsRequest';
import toast from 'react-hot-toast';
import { EmployeeEventSchema } from '../utils/validationSchema';
import { useState } from 'react';

interface EditEmployeeEventProps {
  isOpen: boolean;
  selectedEvent: EmployeeEvent | null;
  onClose: () => void;
  events: Event[];
  employees: Employee[];
  fetchingEvents: () => void;
}

const EditEmployeeEvent = ({isOpen, onClose, events, employees, selectedEvent, fetchingEvents}: EditEmployeeEventProps) => {

    const { token } = useUserAuthContext();
    const [loading, setLoading] = useState(false);
    const initialValues = {
       employeeId: selectedEvent?.employeeId || '',
       eventId: selectedEvent?.eventId?.toString() || '',
       eventDate: selectedEvent?.eventDate?.split('T')[0] || '',
    }

    const handleSubmit = async (values: typeof initialValues) => {
        setLoading(true);
        try {
            const payload = {
                id: selectedEvent?.id,
                employeeId: values.employeeId,
                eventId: Number(values.eventId),
                eventDate: values.eventDate,
            }
          const response = await request({ token }).put('/api/EmployeeEvents', payload);
          if (response && response.status === 200) {
            toast.success('Event updated successfully!');
            fetchingEvents();
            onClose();
          }
        } catch (error) {
            setLoading(false);
            console.error('Failed to update event:', error);
            toast.error('Failed to update event. Please try again.');
        } finally {
            setLoading(false);
        }
    }
  return (
     <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Edit Employee Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Formik
            initialValues={initialValues}
            validationSchema={EmployeeEventSchema}
            onSubmit={handleSubmit}
            >
            {({ isSubmitting, errors, touched, handleBlur, handleChange, values }) => {
                console.log(values);
                return(
                <Form className="space-y-6">
                <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Employee
                    </label>
                    <Select
                    id="employeeId"
                    name="employeeId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.employeeId}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.employeeId && touched.employeeId
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Select employee">
                        {
                            employees?.map((employee) => (
                                <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
                            ))
                        }
                    </Select>
                    <ErrorMessage
                    name="employeeId"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                    />
                </div>
                <div>
                    <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                    </label>
                    <Select
                    id="eventId"
                    name="eventId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.eventId}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.eventId && touched.eventId
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Select event type">
                        {
                            events?.map((event) => (
                                <option key={event.id} value={event.id}>{event.name}</option>
                            ))
                        }
                    </Select>
                    <ErrorMessage
                    name="eventId"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                    />
                </div>
                    <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                    </label>
                    <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    autoComplete="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.eventDate}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.eventDate && touched.eventDate
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Enter event date"
                    />
                    <ErrorMessage
                    name="eventDate"
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
                    {loading ? 'Submitting...' : 'Submit'}
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

export default EditEmployeeEvent