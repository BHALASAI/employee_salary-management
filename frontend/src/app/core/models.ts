export type Role = 'ADMIN' | 'HR_MANAGER' | 'VIEWER';

export interface UserSession {
  username: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: UserSession;
}

export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number;
  effectiveDate: string;
  active: boolean;
}

export type EmployeePayload = Omit<Employee, 'id'>;

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CurrencyMetric {
  currency: string;
  employeeCount: number;
  totalBaseSalary: number;
}

export interface Metric {
  label: string;
  employeeCount: number;
}

export interface DashboardSummary {
  headcount: number;
  activeHeadcount: number;
  averageBaseSalary: number;
  averageBonus: number;
  byCurrency: CurrencyMetric[];
  byCountry: Metric[];
  byDepartment: Metric[];
}

export interface ApiError {
  message: string;
  validationErrors?: Record<string, string>;
}
