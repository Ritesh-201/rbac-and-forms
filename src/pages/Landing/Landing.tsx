import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Shield } from 'lucide-react';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className={styles.landing}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.hero} variants={itemVariants}>
        <h1 className={styles.title}>
          Guide to Advanced React by Ritesh
        </h1>
        <p className={styles.subtitle}>
          Master complex form management with React Hook Form and implement robust 
          Role-Based Access Control with CASL through interactive, hands-on learning.
        </p>
      </motion.div>

      <motion.div className={styles.features} variants={itemVariants}>
        <motion.div 
          className={styles.explorationCard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/forms')}
        >
          <FileText className={styles.cardIcon} />
          <h2 className={styles.cardTitle}>Master React Hook Form</h2>
          <p className={styles.cardDescription}>
            Explore advanced form patterns including multi-step wizards, dynamic fields, 
            file uploads, and complex validation with Zod. Learn through interactive demos 
            with detailed explanations.
          </p>
          <button className={styles.cardButton}>
            Begin Exploration
          </button>
        </motion.div>

        <motion.div 
          className={styles.explorationCard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/rbac')}
        >
          <Shield className={styles.cardIcon} />
          <h2 className={styles.cardTitle}>RBAC with CASL</h2>
          <p className={styles.cardDescription}>
            Discover role-based access control through a real-world HR project management 
            system. Switch between roles to see permissions in action with a Kanban board interface.
          </p>
          <button className={styles.cardButton}>
            Begin Exploration
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Landing;