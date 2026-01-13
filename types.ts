
export enum Role {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor',
  FOREMAN = 'Foreman',
  WORKER = 'Worker'
}

export enum ExpenseCategory {
  TRANSPORT = 'Transport',
  FOOD = 'Food',
  MATERIAL = 'Material',
  OTHER = 'Other'
}

export enum Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  userId: string;
  name: string;
  passportIc: string;
  password?: string;
  basicSalary: number;
  project: string;
  role: Role;
  isFrozen: boolean;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  inTime: string;
  outTime?: string;
  status: Status;
  workDescription: string;
  photoIn?: string;
  photoOut?: string;
  project: string;
  hoursWorked: number;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  project: string;
  photo?: string;
  status: Status;
}

export interface Advance {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: Status; // User must accept/decline
}

export interface Project {
  id: string;
  name: string;
}

export type Language = 'en' | 'bn';
