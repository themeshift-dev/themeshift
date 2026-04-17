import classNames from 'classnames';
import { cloneElement, type ReactElement, type ReactNode } from 'react';

import styles from './GuideExamples.module.scss';

export type GuideExamplesGridProps = {
  children: ReactNode;
  className?: string;
};

export const GuideExamplesGrid = ({
  children,
  className,
}: GuideExamplesGridProps) => (
  <div className={classNames(styles.grid, className)}>{children}</div>
);

export type GuideExampleCardProps = {
  children: ReactNode;
  className?: string;
};

export const GuideExampleCard = ({
  children,
  className,
}: GuideExampleCardProps) => (
  <div className={classNames(styles.card, className)}>{children}</div>
);

export type GuideExampleTextProps = {
  children: ReactNode;
  className?: string;
};

export const GuideExampleText = ({
  children,
  className,
}: GuideExampleTextProps) => (
  <div className={classNames(styles.text, className)}>{children}</div>
);

export type GuideExampleViewerProps = {
  children: ReactElement<{ className?: string }>;
};

export const GuideExampleViewer = ({ children }: GuideExampleViewerProps) =>
  cloneElement(children, {
    className: classNames(styles.viewer, children.props.className),
  });
