interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export type { RegisterFormValues };

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface Event {
  id: number;
  name: string;
  isDepricated: boolean;
}
export interface EventResponse {
  data: Event[];
  errorMessage: string;
  isSuccessful: boolean;
  messageMessage: string;
} 

export interface EmployeeEvent {
  id: number;
  employeeId: number;
  eventId: number;
  eventDate: string;
  employeeFirstName: string;
  employeeLastName: string;
  employeeEmailAddress: string;
  eventTitle: string;
}

export interface EmployeeEventsResponse {
  data: EmployeeEvent[];
  errorMessage: string;
  isSuccessful: boolean;
  messageMessage: string;
} 

export interface Role {
  id: number;
  name: string;
}