import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers, Upload, X, Check } from 'lucide-react';
import MultiStepForm from '../../components/Forms/MultiStepForm';
import DynamicForm from '../../components/Forms/DynamicForm';
import FileUploadForm from '../../components/Forms/FileUploadForm';
import Tooltip from '../../components/UI/Tooltip';
import styles from './Forms.module.css';

type DemoType = 'multistep' | 'dynamic' | 'upload' | null;

const demos = [
  {
    id: 'multistep',
    title: 'Multi-Step Wizard',
    description: 'A comprehensive four-step form with progress tracking, step validation, and state persistence across navigation.',
    icon: FileText,
    features: [
      'Progressive validation with Zod schemas',
      'Visual progress tracking',
      'State persistence across steps',
      'Conditional navigation based on validity'
    ]
  },
  {
    id: 'dynamic',
    title: 'Dynamic & Conditional Fields',
    description: 'Forms that adapt based on user input, showing relevant fields dynamically using React Hook Form\'s watch API.',
    icon: Layers,
    features: [
      'Dynamic field arrays',
      'Conditional field rendering',
      'Real-time form adaptation',
      'Nested validation schemas'
    ]
  },
  {
    id: 'upload',
    title: 'File Upload & Validation',
    description: 'Drag-and-drop file uploads with image previews, file type validation, and size restrictions.',
    icon: Upload,
    features: [
      'Drag-and-drop interface',
      'File type and size validation',
      'Image preview functionality',
      'Multiple file handling'
    ]
  }
];

const Forms: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoType>(null);
  const [selectedDemo, setSelectedDemo] = useState<DemoType>(null);

  const handleDemoClick = (demoId: DemoType) => {
    setSelectedDemo(demoId);
    setActiveDemo(demoId);
  };

  const handleCloseDemo = () => {
    setSelectedDemo(null);
    setActiveDemo(null);
  };
  const renderActiveDemo = () => {
    switch (selectedDemo) {
      case 'multistep':
        return <MultiStepForm />;
      case 'dynamic':
        return <DynamicForm />;
      case 'upload':
        return <FileUploadForm />;
      default:
        return null;
    }
  };

  if (selectedDemo) {
    return (
      <motion.div 
        className={styles.demoContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.demoHeader}>
          <h2 className={styles.demoTitle}>
            {demos.find(d => d.id === selectedDemo)?.title}
          </h2>
          <button 
            className={styles.closeButton}
            onClick={handleCloseDemo}
            aria-label="Close demo"
          >
            <X size={24} />
          </button>
        </div>
        {renderActiveDemo()}
      </motion.div>
    );
  }
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Master React Hook Form</h1>
        <p className={styles.description}>
          Explore advanced form patterns through interactive demos. Each example demonstrates 
          core concepts with detailed explanations of the implementation and best practices.
        </p>
      </div>

      <div className={styles.demoGrid}>
        {demos.map((demo) => (
          <motion.div
            key={demo.id}
            className={styles.demoCard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDemoClick(demo.id as DemoType)}
          >
            <demo.icon className={styles.demoIcon} />
            <h3 className={styles.demoTitle}>{demo.title}</h3>
            <p className={styles.demoDescription}>{demo.description}</p>
            <ul className={styles.demoFeatures}>
              {demo.features.map((feature, index) => (
                <li key={index} className={styles.demoFeature}>
                  <Check className={styles.featureIcon} />
                  <Tooltip content={`Learn about: ${feature}`}>
                    {feature}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Forms;