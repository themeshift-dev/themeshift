import { Button } from '@themeshift/ui/components/Button';
import { Navbar } from '@themeshift/ui/components/Navbar';
import { SkipLink } from '@themeshift/ui/components/SkipLink';
import { useTheme } from '@themeshift/ui/contexts';

import '@themeshift/ui/css/base.css';

import '@/css/tokens.css';
import { Link, Logo } from '@/app/components';
import Routes from '@/app/routes';

import styles from './App.module.scss';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <header className={styles.header}>
        <Navbar>
          <Navbar.Container>
            <Navbar.Section align="start">
              <Link to="/" className={styles.logo}>
                <Logo size={120} />
              </Link>

              <div className={styles.links}>
                <Link to="/docs">Docs</Link>
                <Link to="/ui">UI</Link>
                <Link to="/tokens">Design Tokens</Link>
                <Link to="/cli">CLI</Link>
              </div>
            </Navbar.Section>

            <Navbar.Section align="end">
              <Button onClick={toggleTheme}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </Button>
            </Navbar.Section>
          </Navbar.Container>
        </Navbar>
      </header>

      <Routes />
    </>
  );
}

export default App;
