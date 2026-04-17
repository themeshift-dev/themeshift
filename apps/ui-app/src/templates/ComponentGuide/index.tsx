import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { TableOfContents } from '@/app/components';

import styles from './ComponentGuide.module.scss';

export type ComponentGuideSection = {
  content: ReactNode;
  id: string;
  intro?: ReactNode;
  label?: string;
  title: ReactNode;
};

const getSectionLabel = ({ id, label, title }: ComponentGuideSection) => {
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
}: ComponentGuideSection) => (
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

type ComponentGuideProps = {
  breadcrumb?: ReactNode;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  accessibility?: ComponentGuideSection;
  examples?: ComponentGuideSection;
  howToUse?: ComponentGuideSection;
  intro?: ReactNode;
  propsSection?: ComponentGuideSection;
  title: ReactNode;
  toc?: ReactNode;
  tocLabel?: string;
};

export const ComponentGuide = ({
  accessibility,
  breadcrumb,
  children,
  className,
  description,
  eyebrow,
  examples,
  howToUse,
  intro,
  propsSection,
  title,
  toc,
  tocLabel = 'On this page',
}: ComponentGuideProps) => {
  const content = (
    <PageShell
      className={classNames(styles.container, className)}
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
          {howToUse && <GuideSection {...howToUse} />}
          {propsSection && <GuideSection {...propsSection} />}
          {examples && <GuideSection {...examples} />}
          {accessibility && <GuideSection {...accessibility} />}
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
