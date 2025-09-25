interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export type { RegisterFormValues };

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface EmployeeResponse {
  item: Employee[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageIndex: number;
  totalPages: number;
}

export interface Event {
  id: number;
  name: string;
  message: string;
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
  isApproved: boolean;
  status: string;
  employeeFirstName: string;
  employeeLastName: string;
  employeeEmailAddress: string;
  eventTitle: string;
}

export interface EmployeeEventsResponse {
  item: EmployeeEvent[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageIndex: number;
  totalPages: number;
}

export interface Role {
  id: number;
  name: string;
}