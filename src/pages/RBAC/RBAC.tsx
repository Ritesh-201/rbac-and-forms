import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Lock } from 'lucide-react';
import { User } from '../../types/rbac';
import { mockUsers, initialBoardData } from '../../data/mockData';
import { useAbility } from '../../hooks/useAbility';
import RoleSwitcher from '../../components/RBAC/RoleSwitcher';
import KanbanBoard from '../../components/RBAC/KanbanBoard';
import Tooltip from '../../components/UI/Tooltip';
import styles from './RBAC.module.css';

const RBAC: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Start with admin
  const [boardData, setBoardData] = useState(initialBoardData);
  const ability = useAbility(currentUser);

  const canManageTeam = ability.can('manage', 'User');
  const isReadOnly = currentUser.role === 'guest';

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>RBAC with CASL</h1>
        <p className={styles.description}>
          Experience role-based access control in action. Switch between different user roles 
          to see how permissions affect the interface and available actions in real-time.
        </p>
      </div>

      <RoleSwitcher 
        currentUser={currentUser} 
        onUserChange={setCurrentUser}
      />

      <div className={styles.boardContainer}>
        {isReadOnly && (
          <div className={styles.readOnlyOverlay}>
            <div className={styles.readOnlyBanner}>
              <Lock size={16} />
              <Tooltip content="You are viewing in Guest mode. All interactions are disabled to demonstrate read-only permissions.">
                Read-Only Mode Active
              </Tooltip>
            </div>
          </div>
        )}
        
        <div className={styles.boardHeader}>
          <h2 className={styles.boardTitle}>HR Project Management Board</h2>
          {canManageTeam && (
            <Tooltip content="This button is only visible to Admins. It demonstrates component-level permission checks with CASL's ability.can() method.">
              <button className={styles.manageTeamButton}>
                <Settings size={16} />
                Manage Team
              </button>
            </Tooltip>
          )}
        </div>

        <KanbanBoard 
          boardData={boardData}
          currentUser={currentUser}
          onBoardUpdate={setBoardData}
        />
      </div>
    </motion.div>
  );
};

export default RBAC;