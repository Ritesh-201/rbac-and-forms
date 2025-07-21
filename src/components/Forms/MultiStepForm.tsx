import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { 
  personalInfoSchema, 
  addressInfoSchema, 
  preferencesSchema, 
  reviewSchema,
  type MultiStepFormData 
} from '../../types/forms';
import ProgressBar from './ProgressBar';
import FormField from './FormField';
import Button from '../UI/Button';
import Tooltip from '../UI/Tooltip';
import styles from './MultiStepForm.module.css';

const steps = [
  {
    id: 1,
    label: 'Personal',
    tooltip: 'This step collects your basic personal information. Each field has real-time validation using Zod schemas.'
  },
  {
    id: 2,
    label: 'Address',
    tooltip: 'Address information step. Notice how the form state persists as you navigate between steps.'
  },
  {
    id: 3,
    label: 'Preferences',
    tooltip: 'User preferences step. This demonstrates different input types including checkboxes and select dropdowns.'
  },
  {
    id: 4,
    label: 'Review',
    tooltip: 'Final review step. All form data is displayed for confirmation before submission.'
  }
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<MultiStepFormData>({
    resolver: zodResolver(
      currentStep === 1 ? personalInfoSchema :
      currentStep === 2 ? addressInfoSchema :
      currentStep === 3 ? preferencesSchema :
      reviewSchema
    ),
    mode: 'onChange'
  });

  const { register, handleSubmit, formState: { errors, isValid }, watch, trigger } = form;

  const formData = watch();

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: MultiStepFormData) => {
    console.log('Form submitted:', data);
    localStorage.setItem('multiStepFormData', JSON.stringify(data));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.successMessage}>
            <CheckCircle2 className={styles.successIcon} />
            <h2 className={styles.successTitle}>Form Submitted Successfully!</h2>
            <p className={styles.successDescription}>
              Your information has been saved to localStorage. In a real application, 
              this would be sent to a server. You can check the browser's developer 
              tools to see the stored data.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                form.reset();
              }}
              style={{ marginTop: 'var(--spacing-lg)' }}
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className={styles.stepTitle}>Personal Information</h2>
            <p className={styles.stepDescription}>
              Let's start with your basic information. Notice how validation prevents 
              progression until all fields are correctly filled.
            </p>
            <div className={styles.formGrid}>
              <FormField
                name="firstName"
                label="First Name"
                register={register}
                error={errors.firstName}
                required
                tooltip="This field uses Zod validation with a minimum length requirement"
              />
              <FormField
                name="lastName"
                label="Last Name"
                register={register}
                error={errors.lastName}
                required
                tooltip="Real-time validation ensures immediate feedback"
              />
              <FormField
                name="email"
                label="Email Address"
                type="email"
                register={register}
                error={errors.email}
                required
                tooltip="Email validation uses Zod's built-in email schema"
              />
              <FormField
                name="phone"
                label="Phone Number"
                type="tel"
                register={register}
                error={errors.phone}
                required
                tooltip="Custom regex validation ensures only digits are allowed"
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className={styles.stepTitle}>Address Information</h2>
            <p className={styles.stepDescription}>
              Your address details. The form state is preserved as you navigate 
              between steps using React Hook Form's centralized state management.
            </p>
            <div className={styles.formGrid}>
              <div className={styles.formGrid + ' ' + styles.single}>
                <FormField
                  name="street"
                  label="Street Address"
                  register={register}
                  error={errors.street}
                  required
                  tooltip="Form state persists across steps - your previous data is still there!"
                />
              </div>
              <FormField
                name="city"
                label="City"
                register={register}
                error={errors.city}
                required
              />
              <FormField
                name="state"
                label="State"
                register={register}
                error={errors.state}
                required
              />
              <FormField
                name="zipCode"
                label="ZIP Code"
                register={register}
                error={errors.zipCode}
                required
                tooltip="Validation includes both minimum and maximum length constraints"
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className={styles.stepTitle}>Preferences</h2>
            <p className={styles.stepDescription}>
              Configure your preferences. This step demonstrates different input types 
              including checkboxes and select dropdowns.
            </p>
            <div className={styles.formGrid + ' ' + styles.single}>
              <FormField
                name="newsletter"
                label="Subscribe to newsletter"
                type="checkbox"
                register={register}
                tooltip="Checkbox inputs are managed by React Hook Form's register function"
              />
              <FormField
                name="notifications"
                label="Enable notifications"
                type="checkbox"
                register={register}
                tooltip="Boolean values are handled seamlessly in the form state"
              />
              <FormField
                name="theme"
                label="Preferred Theme"
                type="select"
                register={register}
                error={errors.theme}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' }
                ]}
                tooltip="Select inputs with predefined options using Zod enum validation"
              />
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className={styles.stepTitle}>Review & Submit</h2>
            <p className={styles.stepDescription}>
              Please review your information before submitting. All form data is 
              displayed using React Hook Form's watch API.
            </p>
            
            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>Personal Information</h3>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Name:</span>
                <span className={styles.reviewValue}>
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Email:</span>
                <span className={styles.reviewValue}>{formData.email}</span>
              </div>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Phone:</span>
                <span className={styles.reviewValue}>{formData.phone}</span>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>Address</h3>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Street:</span>
                <span className={styles.reviewValue}>{formData.street}</span>
              </div>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>City, State ZIP:</span>
                <span className={styles.reviewValue}>
                  {formData.city}, {formData.state} {formData.zipCode}
                </span>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>Preferences</h3>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Newsletter:</span>
                <span className={styles.reviewValue}>
                  {formData.newsletter ? 'Subscribed' : 'Not subscribed'}
                </span>
              </div>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Notifications:</span>
                <span className={styles.reviewValue}>
                  {formData.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Theme:</span>
                <span className={styles.reviewValue}>
                  {formData.theme || 'Not selected'}
                </span>
              </div>
            </div>

            <div className={styles.formGrid + ' ' + styles.single}>
              <FormField
                name="terms"
                label="I accept the terms and conditions"
                type="checkbox"
                register={register}
                error={errors.terms}
                required
                tooltip="Required checkbox validation ensures user consent before submission"
              />
              <FormField
                name="privacy"
                label="I accept the privacy policy"
                type="checkbox"
                register={register}
                error={errors.privacy}
                required
                tooltip="Multiple required checkboxes can be validated independently"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <ProgressBar steps={steps} currentStep={currentStep} />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.stepContent}>
            {renderStepContent()}
          </div>

          <div className={styles.navigation}>
            <div className={styles.stepInfo}>
              Step {currentStep} of {steps.length}
            </div>
            
            <div className={styles.buttonGroup}>
              {currentStep > 1 && (
                <Button variant="secondary" type="button" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Tooltip content={!isValid ? "Please fill in all required fields correctly to proceed" : "All fields are valid. Click to continue to the next step"}>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isValid}
                  >
                    Next
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content="Submit the form to save data to localStorage">
                  <Button 
                    type="submit"
                    disabled={!isValid}
                  >
                    Submit
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;