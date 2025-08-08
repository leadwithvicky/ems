import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Play, Square } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mockAttendanceRecords, mockEmployees } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<string | null>(null);

  const currentMonth = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: monthEnd });

  const getAttendanceForDay = (date: Date) => {
    return mockAttendanceRecords.find(record => 
      isSameDay(new Date(record.date), date)
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
      case 'half-day': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'present': return <CheckCircle size={20} className="text-green-500" />;
      case 'absent': return <XCircle size={20} className="text-red-500" />;
      case 'late': return <AlertCircle size={20} className="text-yellow-500" />;
      case 'half-day': return <Clock size={20} className="text-blue-500" />;
      default: return null;
    }
  };

  const handlePunchToggle = () => {
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchInTime(format(new Date(), 'HH:mm'));
    } else {
      setIsPunchedIn(false);
      setPunchInTime(null);
      // Here you would typically save the complete attendance record
    }
  };

  const todayAttendance = getAttendanceForDay(new Date());
  const monthlyStats = {
    totalDays: daysInMonth.length,
    presentDays: mockAttendanceRecords.filter(r => 
      r.status === 'present' || r.status === 'late'
    ).length,
    absentDays: mockAttendanceRecords.filter(r => r.status === 'absent').length,
    lateDays: mockAttendanceRecords.filter(r => r.status === 'late').length
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your daily attendance</p>
        </div>
        
        {/* Punch In/Out Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center space-x-4"
        >
          <div className="text-right text-sm text-gray-600 dark:text-gray-400">
            <p>{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {format(new Date(), 'HH:mm')}
            </p>
          </div>
          <Button
            onClick={handlePunchToggle}
            className={`flex items-center space-x-2 px-6 py-3 ${
              isPunchedIn 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            size="lg"
          >
            {isPunchedIn ? <Square size={24} /> : <Play size={24} />}
            <span>{isPunchedIn ? 'Punch Out' : 'Punch In'}</span>
          </Button>
        </motion.div>
      </div>

      {/* Today's Status */}
      {(isPunchedIn || punchInTime) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  {isPunchedIn ? 'Currently Working' : 'Work Completed'}
                </h3>
                <p className="text-green-600 dark:text-green-400">
                  Punched in at {punchInTime}
                  {!isPunchedIn && ` • Punched out at ${format(new Date(), 'HH:mm')}`}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Stats */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
              Monthly Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Present Days</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {monthlyStats.presentDays}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Absent Days</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {monthlyStats.absentDays}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Late Days</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {monthlyStats.lateDays}
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Attendance Rate
                  </span>
                  <span className="font-bold text-lg text-green-600">
                    {Math.round((monthlyStats.presentDays / monthlyStats.totalDays) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Attendance */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {mockAttendanceRecords.slice(0, 5).map((record, index) => {
                const employee = mockEmployees.find(emp => emp.id === record.employeeId);
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(record.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {user?.role === 'admin' ? employee?.name : 'You'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {record.punchIn && `${record.punchIn} - ${record.punchOut || 'Active'}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(record.date), 'MMM dd')}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {format(selectedDate, 'MMMM yyyy')}
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}

              {/* Days */}
              {daysInMonth.map(day => {
                const attendance = getAttendanceForDay(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <motion.div
                    key={day.toISOString()}
                    whileHover={{ scale: 1.05 }}
                    className={`relative p-2 h-12 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isCurrentDay 
                        ? 'border-coral bg-coral/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isCurrentDay 
                        ? 'text-coral' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    {attendance && (
                      <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${getStatusColor(attendance.status)}`} />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Absent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Half Day</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Attendance;