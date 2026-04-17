import { Button } from '@themeshift/ui/components/Button';
import { Navbar } from '@themeshift/ui/components/Navbar';
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
      <header className={styles.header}>
        <Navbar>
          <Navbar.Container>
            <Navbar.Section align="start">
              <Link to="/" className={styles.logo}>
                <Logo size={120} />
              </Link>

              <div className={styles.links}>
                <Link to="/ui">UI</Link>
                <Link to="/tokens">Design Tokens</Link>
                <Link to="/plugin">Plugin</Link>
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
