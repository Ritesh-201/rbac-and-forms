import React, { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  interactive?: boolean;
  size?: 'normal' | 'large';
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  interactive = false,
  size = 'normal',
  onClick,
  className = ''
}) => {
  const classes = [
    styles.card,
    interactive ? styles.interactive : '',
    size === 'large' ? styles.large : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default Card;