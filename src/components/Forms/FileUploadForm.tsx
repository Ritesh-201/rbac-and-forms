import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, X, CheckCircle } from 'lucide-react';
import { fileUploadSchema, type FileUploadData } from '../../types/forms';
import FormField from './FormField';
import Tooltip from '../UI/Tooltip';
import styles from './FileUploadForm.module.css';

const FileUploadForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<Omit<FileUploadData, 'files'>>({
    resolver: zodResolver(fileUploadSchema.omit({ files: true })),
    mode: 'onChange'
  });

  const { register, handleSubmit, formState: { errors, isValid }, reset } = form;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className={styles.fileIcon} />;
    }
    return <File className={styles.fileIcon} />;
  };

  const isFormValid = isValid && files.length > 0;

  const onSubmit = (data: Omit<FileUploadData, 'files'>) => {
    const formData = { ...data, files };
    console.log('File upload form submitted:', formData);
    
    // Simulate file upload
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    localStorage.setItem('fileUploadData', JSON.stringify({
      ...data,
      files: fileData
    }));
    
    setIsSubmitted(true);
  };

  const resetForm = () => {
    reset();
    setFiles([]);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.successMessage}>
            <CheckCircle size={48} style={{ color: 'var(--color-success)', margin: '0 auto var(--spacing-md)' }} />
            <h3 className={styles.successTitle}>Files Uploaded Successfully!</h3>
            <p className={styles.successText}>
              {files.length} file(s) have been processed. In a real application, 
              these would be uploaded to a server. Check localStorage to see the saved data.
            </p>
            <button 
              onClick={resetForm}
              style={{ 
                marginTop: 'var(--spacing-lg)', 
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Upload More Files
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>File Upload & Validation</h2>
        <p className={styles.description}>
          This demo showcases drag-and-drop file uploads with client-side validation. 
          Files are validated for type and size before being added to the form state.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <FormField
              name="title"
              label="Upload Title"
              register={register}
              error={errors.title}
              required
              placeholder="Enter a title for this upload"
              tooltip="A descriptive title helps organize your uploads"
            />
            <FormField
              name="category"
              label="File Category"
              type="select"
              register={register}
              error={errors.category}
              required
              options={[
                { value: 'image', label: 'Images' },
                { value: 'document', label: 'Documents' },
                { value: 'other', label: 'Other' }
              ]}
              tooltip="Categorizing files helps with organization and processing"
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
              placeholder="Describe the contents of your upload..."
              tooltip="A detailed description provides context for the uploaded files"
            />
          </div>

          <Tooltip content="Drag and drop files here, or click to browse. Supports images, PDFs, and documents up to 5MB each.">
            <div 
              {...getRootProps()} 
              className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${isDragReject ? styles.error : ''}`}
            >
              <input {...getInputProps()} />
              <Upload className={styles.dropzoneIcon} />
              <div className={styles.dropzoneText}>
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
              </div>
              <div className={styles.dropzoneSubtext}>
                or click to browse (max 5MB per file)
              </div>
            </div>
          </Tooltip>

          {files.length > 0 && (
            <div className={styles.fileList}>
              <h3 className={styles.fileListTitle}>
                Selected Files ({files.length})
              </h3>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name}
                        className={styles.imagePreview}
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                    <div className={styles.fileDetails}>
                      <div className={styles.fileName}>{file.name}</div>
                      <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <Tooltip content="Remove this file from the upload">
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className={styles.removeButton}
                    >
                      <X size={16} />
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!isFormValid}
          >
            Upload Files ({files.length})
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUploadForm;