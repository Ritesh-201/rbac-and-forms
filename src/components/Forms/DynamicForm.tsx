import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, CreditCard, HelpCircle } from 'lucide-react';
import { 
  issueTypeSchema, 
  technicalDetailsSchema, 
  billingDetailsSchema,
  type IssueType,
  type TechnicalDetails,
  type BillingDetails
} from '../../types/forms';
import FormField from './FormField';
import Tooltip from '../UI/Tooltip';
import styles from './DynamicForm.module.css';

type FormData = IssueType & Partial<TechnicalDetails> & Partial<BillingDetails>;

const DynamicForm: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(issueTypeSchema),
    mode: 'onChange',
    defaultValues: {
      priority: 'medium'
    }
  });

  const { register, handleSubmit, formState: { errors, isValid }, watch, reset } = form;

  const watchedIssueType = watch('issueType');

  const onSubmit = (data: FormData) => {
    console.log('Dynamic form submitted:', data);
    setSubmittedData(data);
    localStorage.setItem('dynamicFormData', JSON.stringify(data));
  };

  const resetForm = () => {
    reset();
    setSubmittedData(null);
  };

  const renderConditionalFields = () => {
    if (!watchedIssueType) return null;

    switch (watchedIssueType) {
      case 'technical':
        return (
          <div className={styles.conditionalSection}>
            <h3 className={styles.sectionTitle}>
              <Settings className={styles.sectionIcon} />
              <Tooltip content="These fields appear dynamically based on your issue type selection. This demonstrates React Hook Form's watch API for conditional rendering.">
                Technical Details
              </Tooltip>
            </h3>
            <div className={styles.formGrid}>
              <FormField
                name="operatingSystem"
                label="Operating System"
                register={register}
                error={errors.operatingSystem}
                required
                placeholder="e.g., Windows 11, macOS Monterey"
                tooltip="This field is required when 'Technical' issue type is selected"
              />
              <FormField
                name="browserVersion"
                label="Browser Version"
                register={register}
                error={errors.browserVersion}
                required
                placeholder="e.g., Chrome 120.0"
                tooltip="Browser information helps diagnose compatibility issues"
              />
              <div className={styles.formGrid + ' ' + styles.single}>
                <FormField
                  name="errorMessage"
                  label="Error Message (Optional)"
                  type="textarea"
                  register={register}
                  error={errors.errorMessage}
                  placeholder="Copy and paste any error messages you received"
                  tooltip="Error messages provide crucial debugging information"
                />
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className={styles.conditionalSection}>
            <h3 className={styles.sectionTitle}>
              <CreditCard className={styles.sectionIcon} />
              <Tooltip content="Billing-specific fields with number validation. Notice how the form schema adapts to include billing validation rules.">
                Billing Information
              </Tooltip>
            </h3>
            <div className={styles.formGrid}>
              <FormField
                name="accountNumber"
                label="Account Number"
                register={register}
                error={errors.accountNumber}
                required
                placeholder="Enter your account number"
                tooltip="Your account number helps us locate your billing information"
              />
              <FormField
                name="billingPeriod"
                label="Billing Period"
                type="select"
                register={register}
                error={errors.billingPeriod}
                required
                options={[
                  { value: 'current', label: 'Current Month' },
                  { value: 'previous', label: 'Previous Month' },
                  { value: 'quarter', label: 'This Quarter' },
                  { value: 'custom', label: 'Custom Range' }
                ]}
                tooltip="Select the billing period related to your inquiry"
              />
              <div className={styles.formGrid + ' ' + styles.single}>
                <FormField
                  name="amount"
                  label="Disputed Amount ($)"
                  type="number"
                  register={register}
                  error={errors.amount}
                  placeholder="0.00"
                  tooltip="Enter the amount in question (numbers only)"
                />
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className={styles.conditionalSection}>
            <h3 className={styles.sectionTitle}>
              <HelpCircle className={styles.sectionIcon} />
              <Tooltip content="General inquiries require only the basic information above. This demonstrates how some selections don't trigger additional fields.">
                General Inquiry
              </Tooltip>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              No additional information required for general inquiries. 
              Please provide a detailed description above.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Dynamic Support Form</h2>
        <p className={styles.description}>
          This form demonstrates dynamic field rendering based on user selections. 
          Choose an issue type to see relevant fields appear automatically using 
          React Hook Form's watch API and conditional validation schemas.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <FormField
              name="issueType"
              label="Issue Type"
              type="select"
              register={register}
              error={errors.issueType}
              required
              options={[
                { value: 'technical', label: 'Technical Issue' },
                { value: 'billing', label: 'Billing Question' },
                { value: 'general', label: 'General Inquiry' }
              ]}
              tooltip="Selecting an issue type will dynamically show relevant fields below"
            />
            <FormField
              name="priority"
              label="Priority Level"
              type="select"
              register={register}
              error={errors.priority}
              required
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
              tooltip="Priority helps us route your request appropriately"
            />
          </div>

          <div className={styles.formGrid + ' ' + styles.single}>
            <FormField
              name="description"
              label="Description"
              type="textarea"
              register={register}
              error={errors.description}
              required
              placeholder="Please describe your issue in detail..."
              tooltip="A detailed description helps us provide better assistance"
            />
          </div>

          {renderConditionalFields()}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!isValid}
          >
            Submit Support Request
          </button>

          {submittedData && (
            <div className={styles.resultSection}>
              <h3 className={styles.resultTitle}>Form Submitted Successfully!</h3>
              <div className={styles.resultData}>
                {JSON.stringify(submittedData, null, 2)}
              </div>
              <button 
                type="button" 
                onClick={resetForm}
                style={{ 
                  marginTop: 'var(--spacing-md)', 
                  background: 'var(--color-gray-500)',
                  color: 'white',
                  border: 'none',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                Reset Form
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;