import React from 'react';
import { Check } from 'lucide-react';
import Tooltip from '../UI/Tooltip';
import styles from './ProgressBar.module.css';

interface Step {
  id: number;
  label: string;
  tooltip: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressLine} 
          style={{ width: `${progressPercentage}%` }}
        />
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <Tooltip key={step.id} content={step.tooltip}>
              <div className={styles.step}>
                <div 
                  className={`${styles.stepCircle} ${
                    isActive ? styles.active : ''
                  } ${isCompleted ? styles.completed : ''}`}
                >
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    step.id
                  )}
                </div>
                <span 
                  className={`${styles.stepLabel} ${
                    isActive ? styles.active : ''
                  } ${isCompleted ? styles.completed : ''}`}
                >
                  {step.label}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;