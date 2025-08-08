import { Employee, AttendanceRecord, LeaveRequest } from '../types';
import { format, subDays, addDays } from 'date-fns';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    phone: '+1-555-0123',
    role: 'Software Engineer',
    department: 'Engineering',
    joiningDate: '2023-01-15',
    status: 'active',
    salary: 75000,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=FF715B&color=fff&size=150'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    phone: '+1-555-0124',
    role: 'Product Manager',
    department: 'Product',
    joiningDate: '2023-03-20',
    status: 'active',
    salary: 85000,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=5E60CE&color=fff&size=150'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    phone: '+1-555-0125',
    role: 'UX Designer',
    department: 'Design',
    joiningDate: '2022-11-10',
    status: 'active',
    salary: 70000,
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=FFD447&color=000&size=150'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@company.com',
    phone: '+1-555-0126',
    role: 'Marketing Specialist',
    department: 'Marketing',
    joiningDate: '2023-06-01',
    status: 'active',
    salary: 60000,
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=FF715B&color=fff&size=150'
  },
  {
    id: '5',
    name: 'Alex Chen',
    email: 'alex@company.com',
    phone: '+1-555-0127',
    role: 'DevOps Engineer',
    department: 'Engineering',
    joiningDate: '2023-02-28',
    status: 'active',
    salary: 80000,
    avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=5E60CE&color=fff&size=150'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchIn: '09:00',
    punchOut: '17:30',
    status: 'present',
    workingHours: 8.5
  },
  {
    id: '2',
    employeeId: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchIn: '09:15',
    punchOut: '17:45',
    status: 'late',
    workingHours: 8.5
  },
  {
    id: '3',
    employeeId: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'absent'
  },
  {
    id: '4',
    employeeId: '4',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchIn: '08:45',
    punchOut: '17:15',
    status: 'present',
    workingHours: 8.5
  },
  {
    id: '5',
    employeeId: '5',
    date: format(new Date(), 'yyyy-MM-dd'),
    punchIn: '09:30',
    status: 'present'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    type: 'casual',
    startDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    reason: 'Family vacation',
    status: 'pending',
    appliedDate: format(subDays(new Date(), 2), 'yyyy-MM-dd')
  },
  {
    id: '2',
    employeeId: '2',
    type: 'sick',
    startDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    reason: 'Medical consultation',
    status: 'approved',
    appliedDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    approvedBy: 'Admin User',
    approvedDate: format(subDays(new Date(), 4), 'yyyy-MM-dd')
  },
  {
    id: '3',
    employeeId: '4',
    type: 'annual',
    startDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    reason: 'Annual vacation',
    status: 'approved',
    appliedDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    approvedBy: 'Admin User',
    approvedDate: format(new Date(), 'yyyy-MM-dd')
  }
];

export const getDashboardStats = () => {
  const totalEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const presentToday = mockAttendanceRecords.filter(
    record => record.date === format(new Date(), 'yyyy-MM-dd') && 
    (record.status === 'present' || record.status === 'late')
  ).length;
  const leavesToday = mockLeaveRequests.filter(leave => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return leave.status === 'approved' && 
           leave.startDate <= today && 
           leave.endDate >= today;
  }).length;
  const activeDepartments = [...new Set(mockEmployees.map(emp => emp.department))].length;

  return {
    totalEmployees,
    presentToday,
    leavesToday,
    activeDepartments
  };
};