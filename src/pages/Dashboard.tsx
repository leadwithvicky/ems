import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar, Building, TrendingUp, UserCheck, UserX, Award, Activity, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/UI/Card';
import { getDashboardStats } from '../data/mockData';

const Dashboard: React.FC = () => {
  const stats = getDashboardStats();

  const attendanceData = [
    { name: 'Mon', present: 85, absent: 15 },
    { name: 'Tue', present: 90, absent: 10 },
    { name: 'Wed', present: 82, absent: 18 },
    { name: 'Thu', present: 95, absent: 5 },
    { name: 'Fri', present: 88, absent: 12 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 40, color: '#FF715B' },
    { name: 'Design', value: 25, color: '#FFD447' },
    { name: 'Marketing', value: 20, color: '#5E60CE' },
    { name: 'HR', value: 15, color: '#FF6B9D' },
  ];

  const growthData = [
    { month: 'Jan', employees: 45 },
    { month: 'Feb', employees: 52 },
    { month: 'Mar', employees: 61 },
    { month: 'Apr', employees: 58 },
    { month: 'May', employees: 67 },
    { month: 'Jun', employees: 73 },
  ];

  const statCards = [
    {
      icon: Users,
      label: 'Total Employees',
      value: stats.totalEmployees,
      change: '+12%',
      color: 'from-coral to-yellow',
      description: 'Active team members'
    },
    {
      icon: UserCheck,
      label: 'Present Today',
      value: stats.presentToday,
      change: '+5%',
      color: 'from-green-400 to-green-600',
      description: 'Currently at work'
    },
    {
      icon: UserX,
      label: 'On Leave',
      value: stats.leavesToday,
      change: '-2%',
      color: 'from-orange-400 to-red-500',
      description: 'Out of office'
    },
    {
      icon: Building,
      label: 'Departments',
      value: stats.activeDepartments,
      change: '0%',
      color: 'from-purple to-pink-500',
      description: 'Active divisions'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-coral to-yellow rounded-xl flex items-center justify-center">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Welcome back! Here's what's happening at your company today.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card variant="elevated" className="relative overflow-hidden group">
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline space-x-2 mb-1">
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                      className="text-3xl font-bold text-gray-800 dark:text-white"
                    >
                      {stat.value}
                    </motion.p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      stat.change.startsWith('+') 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : stat.change.startsWith('-')
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white" size={28} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Weekly Attendance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employee presence this week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-coral to-yellow rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF715B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF715B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="present" stroke="#FF715B" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Employee Growth */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Employee Growth</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Team expansion over time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="employees" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5E60CE" />
                    <stop offset="100%" stopColor="#FF715B" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Department Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Department Distribution</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Team allocation across departments</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow to-coral rounded-xl flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="font-medium text-gray-800 dark:text-white">{dept.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {dept.value}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;