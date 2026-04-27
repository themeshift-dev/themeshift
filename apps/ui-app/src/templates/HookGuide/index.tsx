import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { TableOfContents } from '@/app/components';

import styles from './HookGuide.module.scss';

export type HookGuideSection = {
  content: ReactNode;
  id: string;
  intro?: ReactNode;
  label?: string;
  title: ReactNode;
};

const getSectionLabel = ({ id, label, title }: HookGuideSection) => {
  if (label) {
    return label;
  }

  if (typeof title === 'string') {
    return title;
  }

  return id;
};

const GuideSection = ({
  content,
  id,
  intro,
  label,
  title,
}: HookGuideSection) => (
  <section className={styles.section}>
    <TableOfContents.Marker
      id={id}
      label={getSectionLabel({ content, id, intro, label, title })}
    />

    <div className={styles.sectionHeader}>
      <Heading level={3}>{title}</Heading>
      {intro && <p className={styles.sectionIntro}>{intro}</p>}
    </div>

    {content}
  </section>
);

type HookGuideProps = {
  breadcrumb?: ReactNode;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  examples?: HookGuideSection;
  intro?: ReactNode;
  notes?: HookGuideSection;
  optionsSection?: HookGuideSection;
  quickStart?: HookGuideSection;
  returnsSection?: HookGuideSection;
  title: ReactNode;
  toc?: ReactNode;
  tocLabel?: string;
};

export const HookGuide = ({
  breadcrumb,
  children,
  className,
  description,
  eyebrow,
  examples,
  intro,
  notes,
  optionsSection,
  quickStart,
  returnsSection,
  title,
  toc,
  tocLabel = 'On this page',
}: HookGuideProps) => {
  const content = (
    <PageShell
      className={classNames(styles.container, className)}
      showSkipLink={false}
      aside={
        toc ? (
          <div className={styles.aside}>
            <div className={styles.asideInner}>{toc}</div>
          </div>
        ) : undefined
      }
      asideLabel={toc ? tocLabel : undefined}
    >
      <div className={styles.main}>
        {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        {title && <Heading level={2}>{title}</Heading>}
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.content}>
          {intro && <section className={styles.section}>{intro}</section>}
          {quickStart && <GuideSection {...quickStart} />}
          {optionsSection && <GuideSection {...optionsSection} />}
          {returnsSection && <GuideSection {...returnsSection} />}
          {examples && <GuideSection {...examples} />}
          {notes && <GuideSection {...notes} />}
          {children}
        </div>
      </div>
    </PageShell>
  );

  if (!toc) {
    return content;
  }

  return <TableOfContents.Root>{content}</TableOfContents.Root>;
};
