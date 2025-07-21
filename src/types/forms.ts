import { z } from 'zod';

// Multi-step form schemas
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
});

export const addressInfoSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits').max(10, 'ZIP code must be at most 10 characters'),
});

export const preferencesSchema = z.object({
  newsletter: z.boolean(),
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'auto']),
});

export const reviewSchema = z.object({
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  privacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
});

export const multiStepFormSchema = personalInfoSchema
  .merge(addressInfoSchema)
  .merge(preferencesSchema)
  .merge(reviewSchema);

// Dynamic form schema
export const issueTypeSchema = z.object({
  issueType: z.enum(['technical', 'billing', 'general'], {
    required_error: 'Please select an issue type',
  }),
  priority: z.enum(['low', 'medium', 'high']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const technicalDetailsSchema = z.object({
  operatingSystem: z.string().min(1, 'Operating system is required'),
  browserVersion: z.string().min(1, 'Browser version is required'),
  errorMessage: z.string().optional(),
});

export const billingDetailsSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  billingPeriod: z.string().min(1, 'Billing period is required'),
  amount: z.number().min(0, 'Amount must be positive'),
});

// File upload schema
export const fileUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['image', 'document', 'other']),
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type AddressInfo = z.infer<typeof addressInfoSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type MultiStepFormData = z.infer<typeof multiStepFormSchema>;

export type IssueType = z.infer<typeof issueTypeSchema>;
export type TechnicalDetails = z.infer<typeof technicalDetailsSchema>;
export type BillingDetails = z.infer<typeof billingDetailsSchema>;

export type FileUploadData = z.infer<typeof fileUploadSchema>;