import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Clock, User, FileText, Check, X, Filter } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { mockLeaveRequests, mockEmployees } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import type { LeaveRequest } from '../types';

const Leaves: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const leaveTypes = ['sick', 'casual', 'annual', 'maternity', 'paternity'];
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  // Filter leaves based on user role and filters
  React.useEffect(() => {
    let filtered = leaves;
    
    // Filter by user role
    if (user?.role === 'employee') {
      filtered = leaves.filter(leave => leave.employeeId === user.employeeId);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(leave => leave.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(leave => leave.type === typeFilter);
    }

    setFilteredLeaves(filtered);
  }, [leaves, user, statusFilter, typeFilter]);

  const handleApproveReject = (leaveId: string, newStatus: 'approved' | 'rejected') => {
    setLeaves(prev =>
      prev.map(leave =>
        leave.id === leaveId
          ? {
              ...leave,
              status: newStatus,
              approvedBy: user?.name,
              approvedDate: format(new Date(), 'yyyy-MM-dd')
            }
          : leave
      )
    );
  };

  const getEmployeeName = (employeeId: string) => {
    return mockEmployees.find(emp => emp.id === employeeId)?.name || 'Unknown';
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  };

  const leaveStats = {
    total: filteredLeaves.length,
    pending: filteredLeaves.filter(l => l.status === 'pending').length,
    approved: filteredLeaves.filter(l => l.status === 'approved').length,
    rejected: filteredLeaves.filter(l => l.status === 'rejected').length
  };

  const LeaveForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      type: 'casual',
      startDate: '',
      endDate: '',
      reason: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Leave Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          >
            {leaveTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Leave
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsAddModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Submit Request
          </Button>
        </div>
      </form>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Leave Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage leave requests and approvals</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Apply for Leave</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Requests', value: leaveStats.total, color: 'from-blue-500 to-blue-600' },
          { label: 'Pending', value: leaveStats.pending, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Approved', value: leaveStats.approved, color: 'from-green-500 to-green-600' },
          { label: 'Rejected', value: leaveStats.rejected, color: 'from-red-500 to-red-600' }
        ].map((stat, index) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <Calendar className="text-white" size={24} />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Leave
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Leave Requests */}
      <motion.div
        layout
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredLeaves.map((leave, index) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-coral to-yellow rounded-full flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                          {user?.role === 'admin' ? getEmployeeName(leave.employeeId) : 'Your Leave Request'}
                        </h3>
                        <p className="text-coral font-medium capitalize">
                          {leave.type} Leave
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[leave.status]}`}>
                        {leave.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>
                          {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span>{calculateLeaveDays(leave.startDate, leave.endDate)} days</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FileText size={16} />
                        <span>Applied {format(new Date(leave.appliedDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-gray-700 dark:text-gray-300">{leave.reason}</p>

                    {leave.status === 'approved' && leave.approvedBy && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Approved by {leave.approvedBy} on {format(new Date(leave.approvedDate!), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>

                  {/* Admin Actions */}
                  {user?.role === 'admin' && leave.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveReject(leave.id, 'approved')}
                      >
                        <Check size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleApproveReject(leave.id, 'rejected')}
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredLeaves.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No leave requests found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or apply for a new leave</p>
        </motion.div>
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Apply for Leave"
        size="lg"
      >
        <LeaveForm
          onSubmit={(data) => {
            const newLeave: LeaveRequest = {
              id: String(Date.now()),
              employeeId: user?.employeeId || '1',
              ...data,
              status: 'pending',
              appliedDate: format(new Date(), 'yyyy-MM-dd')
            };
            setLeaves(prev => [newLeave, ...prev]);
            setIsAddModalOpen(false);
          }}
        />
      </Modal>
    </motion.div>
  );
};

export default Leaves;