import React, { useState } from 'react';
import { User } from 'lucide-react';
import { User as UserType, Role } from '../../types/rbac';
import { mockEmployees } from '../../data/mockData';
import Tooltip from '../UI/Tooltip';
import styles from './RoleSwitcher.module.css';

interface RoleSwitcherProps {
  currentUser: UserType;
  onUserChange: (user: UserType) => void;
}

const roleDescriptions = {
  admin: 'Full access to all features. Can create, edit, and delete any task. Access to team management.',
  employee: 'Can view all tasks but only modify their own assignments. Limited creation permissions.',
  guest: 'Read-only access. Can view the board but cannot make any changes.'
};

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentUser, onUserChange }) => {
  const [selectedRole, setSelectedRole] = useState<Role>(currentUser.role);
  const [selectedEmployee, setSelectedEmployee] = useState(currentUser.id);

  const handleSwitch = () => {
    let newUser: UserType;
    
    if (selectedRole === 'admin') {
      newUser = {
        id: '1',
        name: 'Admin User',
        role: 'admin',
        email: 'admin@company.com'
      };
    } else if (selectedRole === 'guest') {
      newUser = {
        id: '3',
        name: 'Guest User',
        role: 'guest',
        email: 'guest@company.com'
      };
    } else {
      // Employee role - use selected employee from mock data
      const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
      newUser = {
        id: selectedEmployee,
        name: employee?.name || 'Unknown Employee',
        role: 'employee',
        email: `${employee?.name.toLowerCase().replace(/\s+/g, '.')}@company.com`
      };
    }
    
    onUserChange(newUser);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Role-Based Access Control Demo</h2>
        <p className={styles.description}>
          Switch between different roles to see how permissions affect the user interface and available actions.
        </p>
      </div>

      <div className={`${styles.userForm} ${selectedRole === 'employee' ? styles.withEmployee : ''}`}>
        {selectedRole === 'employee' && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="employeeSelect">
              Select Employee
            </label>
            <select
              id="employeeSelect"
              className={styles.select}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {mockEmployees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="userRole">
            Select Role
          </label>
          <Tooltip content={roleDescriptions[selectedRole]}>
            <select
              id="userRole"
              className={styles.select}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="guest">Guest</option>
            </select>
          </Tooltip>
        </div>

        <button 
          className={styles.switchButton}
          onClick={handleSwitch}
        >
          Switch Role
        </button>
      </div>

      <div className={styles.currentUser}>
        <div className={styles.currentUserTitle}>Currently viewing as:</div>
        <div className={styles.currentUserInfo}>
          <User size={16} />
          <span>{currentUser.name}</span>
          <Tooltip content={roleDescriptions[currentUser.role]}>
            <span className={`${styles.roleTag} ${styles[currentUser.role]}`}>
              {currentUser.role}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;