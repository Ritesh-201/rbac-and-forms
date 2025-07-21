import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isNotHomePage = location.pathname !== '/';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {isNotHomePage && (
          <button 
            className={styles.backButton}
            onClick={() => navigate('/')}
            aria-label="Go back to home"
            title="Back to Home"
          >
            <ArrowLeft className={styles.backIcon} />
            Back
          </button>
        )}
        
        <Link to="/" className={styles.logo}>
          <BookOpen className={styles.logoIcon} />
          Adv React Guide by RS
        </Link>
        
        <nav className={styles.nav}>
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className={styles.themeIcon} />
            ) : (
              <Sun className={styles.themeIcon} />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;