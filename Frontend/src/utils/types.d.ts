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
  name: string;
  email: string;
}