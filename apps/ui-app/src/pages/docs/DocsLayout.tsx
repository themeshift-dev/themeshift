import { PageShell } from '@themeshift/ui/templates';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { Link, TableOfContents } from '@/app/components';

import { docsPages } from './docsPages';
import styles from './DocsLayout.module.scss';

const isDocsPathActive = (pathname: string, path: string) => {
  if (path === '/docs') {
    return pathname === '/docs';
  }

  return pathname === path || pathname.startsWith(`${path}/`);
};

export const DocsLayout = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPageToc, setShowPageToc] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(min-width: 92rem)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 92rem)');
    const handleChange = (event: MediaQueryListEvent) => {
      setShowPageToc(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <TableOfContents.Root>
      <PageShell
        className={styles.container}
        showSkipLink={false}
        aside={
          showPageToc ? (
            <aside className={styles.aside}>
              <div className={styles.asideInner}>
                <TableOfContents.Nav />
              </div>
            </aside>
          ) : undefined
        }
        asideLabel={showPageToc ? 'On this page' : undefined}
      >
        <div className={styles.docsFrame}>
          <section className={styles.sidebar} aria-label="Docs sections">
            <p className={styles.sidebarTitle}>Docs navigation</p>
            <button
              aria-expanded={isMenuOpen}
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen((open) => !open)}
              type="button"
            >
              {isMenuOpen ? 'Hide sections' : 'Show sections'}
            </button>
            <nav
              aria-label="Documentation pages"
              className={classNames(
                styles.sidebarNav,
                isMenuOpen && styles.sidebarNavOpen
              )}
            >
              <ul className={styles.sidebarList}>
                {docsPages.map((page) => {
                  const isActive = isDocsPathActive(
                    location.pathname,
                    page.path
                  );

                  return (
                    <li className={styles.sidebarItem} key={page.id}>
                      <Link
                        className={classNames(
                          styles.sidebarLink,
                          isActive && styles.sidebarLinkActive
                        )}
                        end={page.path === '/docs'}
                        onClick={() => setIsMenuOpen(false)}
                        to={page.path}
                      >
                        <span>{page.label}</span>
                        <span className={styles.sidebarDescription}>
                          {page.description}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </section>

          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </PageShell>
    </TableOfContents.Root>
  );
};
