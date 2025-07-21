import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import Tooltip from '../UI/Tooltip';
import styles from './FormField.module.css';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  tooltip?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  register,
  error,
  required = false,
  placeholder,
  options = [],
  tooltip,
  className = ''
}) => {
  const fieldId = `field-${name}`;

  const renderInput = () => {
    const baseProps = {
      id: fieldId,
      ...register(name),
      className: `${styles.input} ${error ? styles.error : ''}`,
      placeholder
    };

    switch (type) {
      case 'textarea':
        return <textarea {...baseProps} className={`${baseProps.className} ${styles.textarea}`} />;
      
      case 'select':
        return (
          <select {...baseProps} className={`${baseProps.className} ${styles.select}`}>
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className={styles.checkbox}>
            <input
              {...register(name)}
              type="checkbox"
              id={fieldId}
              className=""
            />
            <label htmlFor={fieldId} className={styles.checkboxLabel}>
              {label}
              {required && <span className={styles.required}> *</span>}
            </label>
          </div>
        );
      
      default:
        return <input {...baseProps} type={type} />;
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`${styles.field} ${className}`}>
        {renderInput()}
        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            {error.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={fieldId} className={styles.label}>
        {tooltip ? (
          <Tooltip content={tooltip}>{label}</Tooltip>
        ) : (
          label
        )}
        {required && <span className={styles.required}> *</span>}
      </label>
      {renderInput()}
      {error && (
        <div className={styles.error}>
          <AlertCircle size={16} />
          {error.message}
        </div>
      )}
    </div>
  );
};

export default FormField;