import React, { ReactNode } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className={styles.tooltip}>
      <span className={styles.trigger}>{children}</span>
      <div className={styles.tooltipContent}>{content}</div>
    </div>
  );
};

export default Tooltip;