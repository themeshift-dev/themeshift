import { Button } from '@themeshift/ui/components/Button';
import { Navbar } from '@themeshift/ui/components/Navbar';
import { SkipLink } from '@themeshift/ui/components/SkipLink';
import { useTheme } from '@themeshift/ui/contexts';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiMoon, FiSun } from 'react-icons/fi';

import '@themeshift/ui/css/base.css';

import '@/css/tokens.css';
import { Link, Logo } from '@/app/components';
import Routes from '@/app/routes';

import styles from './App.module.scss';
import { Tooltip } from '@themeshift/ui/components/Tooltip';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <header className={styles.header}>
        <Navbar aria-label="Primary navigation" surface="transparent">
          <Navbar.Container>
            <Navbar.Brand asChild>
              <Link to="/" className={styles.logo}>
                <Logo size={90} />
              </Link>
            </Navbar.Brand>

            <Navbar.Content hideBelow="tablet">
              <div className={styles.links}>
                <Link to="/docs">Docs</Link>
                <Link to="/ui">UI</Link>
                <Link to="/tokens">Design Tokens</Link>
                <Link to="/cli">CLI</Link>
              </div>
            </Navbar.Content>

            <Navbar.Actions hideBelow="tablet">
              <Tooltip
                placement="start"
                content={
                  theme === 'dark' ? 'Use light theme' : 'Use dark theme'
                }
              >
                <Button
                  onClick={toggleTheme}
                  size="large"
                  intent="secondary"
                  aria-label={
                    theme === 'dark' ? 'Use light theme' : 'Use dark theme'
                  }
                >
                  {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </Button>
              </Tooltip>
            </Navbar.Actions>

            <Navbar.Toggle
              aria-label="Open navigation menu"
              showBelow="tablet"
              as={Button}
              size="large"
              variant="outline"
            >
              {(isOpen) => (isOpen ? <FaTimes /> : <FaBars />)}
            </Navbar.Toggle>
          </Navbar.Container>

          <Navbar.Menu
            placement="drawer"
            showBelow="tablet"
            onClickOutside="close"
          >
            <div className={styles.mobileMenu}>
              <div className={styles.mobileLinks}>
                <Link to="/docs">Docs</Link>
                <Link to="/ui">UI</Link>
                <Link to="/tokens">Design Tokens</Link>
                <Link to="/cli">CLI</Link>
              </div>

              <Button
                className={styles.mobileThemeToggle}
                onClick={toggleTheme}
                variant="link"
                startIcon={theme === 'dark' ? <FiSun /> : <FiMoon />}
              >
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </Button>
            </div>
          </Navbar.Menu>
        </Navbar>
      </header>

      <Routes />
    </>
  );
}

export default App;
