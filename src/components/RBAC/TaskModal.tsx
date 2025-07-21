import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, User } from '../../types/rbac';
import { mockEmployees } from '../../data/mockData';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task;
  currentUser: User;
  mode: 'create' | 'edit';
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  currentUser,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    assignedToName: '',
    priority: 'medium' as Task['priority'],
    dueDate: ''
  });

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        assignedToName: task.assignedToName,
        priority: task.priority,
        dueDate: task.dueDate || ''
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        assignedTo: currentUser.role === 'admin' ? '' : currentUser.id,
        assignedToName: currentUser.role === 'admin' ? '' : currentUser.name,
        priority: 'medium',
        dueDate: ''
      });
    }
  }, [task, mode, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    if (currentUser.role === 'admin' && !formData.assignedTo) {
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    setFormData(prev => ({
      ...prev,
      assignedTo: employeeId,
      assignedToName: employee?.name || ''
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Task Title *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description *</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task"
              required
            />
          </div>

          {currentUser.role === 'admin' && (
            <div className={styles.field}>
              <label className={styles.label}>Assign to Employee *</label>
              <select
                className={styles.select}
                value={formData.assignedTo}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                required
              >
                <option value="">Select an employee</option>
                {mockEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Priority</label>
            <select
              className={styles.select}
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              className={styles.input}
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;