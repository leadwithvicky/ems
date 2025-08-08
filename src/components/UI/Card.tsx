import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  variant = 'default'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700 shadow-none'
  };

  return (
    <motion.div
      whileHover={hover ? { 
        y: -4, 
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        duration: 0.2
      }}
      className={`
        rounded-xl transition-all duration-300 ease-in-out
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
        ${hover ? 'hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20' : ''}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;