export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  salary?: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  punchIn?: string;
  punchOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workingHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  employeeId?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  leavesToday: number;
  activeDepartments: number;
}