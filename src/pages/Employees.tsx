import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, Eye, Mail, Phone, Calendar, Users, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { mockEmployees } from '../data/mockData';
import type { Employee } from '../types';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const departments = [...new Set(employees.map(emp => emp.department))];

  // Filter employees based on search and filters
  React.useEffect(() => {
    const filtered = employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    setFilteredEmployees(filtered);
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const EmployeeForm: React.FC<{ employee?: Employee; onSubmit: (data: Partial<Employee>) => void }> = ({ employee, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: employee?.name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      role: employee?.role || '',
      department: employee?.department || '',
      joiningDate: employee?.joiningDate || '',
      status: employee?.status || 'active',
      salary: employee?.salary || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Joining Date
            </label>
            <input
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Salary
            </label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="submit" variant="gradient" icon={<UserPlus size={20} />}>
            {employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-coral to-yellow rounded-xl flex items-center justify-center">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Employees</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your team members and their information</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="gradient"
          size="lg"
          icon={<Plus size={20} />}
        >
          Add Employee
        </Button>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{employees.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-coral to-yellow rounded-xl flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <UserPlus className="text-white" size={24} />
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{departments.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple to-pink-500 rounded-xl flex items-center justify-center">
              <Filter className="text-white" size={24} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Employees Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Card variant="elevated" className="p-6 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-16 h-16 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-coral transition-all duration-300"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate group-hover:text-coral transition-colors duration-200">
                      {employee.name}
                    </h3>
                    <p className="text-coral font-medium">{employee.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.department}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {employee.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail size={16} className="text-coral" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone size={16} className="text-coral" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar size={16} className="text-coral" />
                    <span>Joined {format(new Date(employee.joiningDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsViewModalOpen(true);
                    }}
                    icon={<Eye size={16} />}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsEditModalOpen(true);
                    }}
                    icon={<Edit size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
      >
        <EmployeeForm
          onSubmit={(data) => {
            const newEmployee: Employee = {
              id: Date.now().toString(),
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              role: data.role || '',
              department: data.department || '',
              joiningDate: data.joiningDate || '',
              status: data.status || 'active',
              salary: data.salary || 0,
              avatar: `https://ui-avatars.com/api/?name=${data.name || 'User'}&background=FF715B&color=fff&size=150`
            };
            setEmployees(prev => [...prev, newEmployee]);
            setIsAddModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee"
      >
        <EmployeeForm
          employee={selectedEmployee || undefined}
          onSubmit={(data) => {
            setEmployees(prev => prev.map(emp => 
              emp.id === selectedEmployee?.id 
                ? { ...emp, ...data }
                : emp
            ));
            setIsEditModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Employee Details"
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {selectedEmployee.name}
                </h3>
                <p className="text-coral font-medium">{selectedEmployee.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedEmployee.department}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Email</p>
                <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Phone</p>
                <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.phone}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Status</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedEmployee.status === 'active'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {selectedEmployee.status}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Joined</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(new Date(selectedEmployee.joiningDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Employees;