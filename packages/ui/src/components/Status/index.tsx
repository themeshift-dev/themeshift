/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  Children,
  isValidElement,
  type ElementType,
  type JSX,
  type ReactNode,
} from 'react';

import styles from './Status.module.scss';
import type {
  StatusActionsProps,
  StatusAlign,
  StatusContentProps,
  StatusDensity,
  StatusDescriptionProps,
  StatusIconProps,
  StatusIntent,
  StatusPresetProps,
  StatusProps,
  StatusTitleProps,
  StatusVariant,
} from './types';

const alignClassMap = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
} satisfies Record<StatusAlign, string>;

const densityClassMap = {
  compact: styles.densityCompact,
  comfortable: styles.densityComfortable,
  spacious: styles.densitySpacious,
} satisfies Record<StatusDensity, string>;

const variantClassMap = {
  plain: styles.variantPlain,
  panel: styles.variantPanel,
  subtle: styles.variantSubtle,
} satisfies Record<StatusVariant, string>;

const intentClassMap = {
  neutral: styles.intentNeutral,
  info: styles.intentInfo,
  success: styles.intentSuccess,
  warning: styles.intentWarning,
  danger: styles.intentDanger,
} satisfies Record<StatusIntent, string>;

function validateAsChild(
  asChild: boolean,
  children: ReactNode,
  component: string
) {
  if (!asChild) {
    return;
  }

  if (!isValidElement(children)) {
    throw new Error(
      `${component} with asChild expects a single React element child.`
    );
  }

  Children.only(children);
}

/**
 * Root wrapper for structured empty, error, and no-results experiences.
 */
export const StatusRoot = <T extends ElementType = 'section'>({
  align = 'center',
  'aria-live': ariaLive,
  as,
  children,
  className,
  density = 'comfortable',
  intent = 'neutral',
  role,
  variant = 'plain',
  ...statusProps
}: StatusProps<T>) => {
  const Component = as ?? 'section';

  return (
    <Component
      {...statusProps}
      aria-live={ariaLive}
      className={classNames(
        styles.root,
        alignClassMap[align],
        densityClassMap[density],
        variantClassMap[variant],
        intentClassMap[intent],
        className
      )}
      role={role}
    >
      {children}
    </Component>
  );
};

/**
 * Content wrapper that stacks title and description copy.
 */
export const StatusContent = <T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...contentProps
}: StatusContentProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      {...contentProps}
      className={classNames(styles.content, className)}
    >
      {children}
    </Component>
  );
};

/**
 * Icon slot for visual context in status blocks.
 */
export const StatusIcon = <T extends ElementType = 'div'>({
  as,
  asChild = false,
  children,
  className,
  ...iconProps
}: StatusIconProps<T>) => {
  validateAsChild(asChild, children, 'ThemeShift Status.Icon');

  const Component = as ?? 'div';
  const Comp = asChild ? Slot : Component;

  return (
    <Comp {...iconProps} className={classNames(styles.icon, className)}>
      {children}
    </Comp>
  );
};

/**
 * Title slot for the status heading.
 */
export const StatusTitle = <T extends ElementType = 'h2'>({
  as,
  asChild = false,
  children,
  className,
  ...titleProps
}: StatusTitleProps<T>) => {
  validateAsChild(asChild, children, 'ThemeShift Status.Title');

  const Component = as ?? 'h2';
  const Comp = asChild ? Slot : Component;

  return (
    <Comp {...titleProps} className={classNames(styles.title, className)}>
      {children}
    </Comp>
  );
};

/**
 * Description slot for supporting guidance and next steps.
 */
export const StatusDescription = <T extends ElementType = 'p'>({
  as,
  asChild = false,
  children,
  className,
  ...descriptionProps
}: StatusDescriptionProps<T>) => {
  validateAsChild(asChild, children, 'ThemeShift Status.Description');

  const Component = as ?? 'p';
  const Comp = asChild ? Slot : Component;

  return (
    <Comp
      {...descriptionProps}
      className={classNames(styles.description, className)}
    >
      {children}
    </Comp>
  );
};

/**
 * Actions slot for retry/create/help controls.
 */
export const StatusActions = <T extends ElementType = 'div'>({
  as,
  asChild = false,
  children,
  className,
  ...actionsProps
}: StatusActionsProps<T>) => {
  validateAsChild(asChild, children, 'ThemeShift Status.Actions');

  const Component = as ?? 'div';
  const Comp = asChild ? Slot : Component;

  return (
    <Comp {...actionsProps} className={classNames(styles.actions, className)}>
      {children}
    </Comp>
  );
};

function StatusPreset({
  actions,
  children,
  defaultDescription,
  description,
  icon,
  title,
  ...props
}: StatusPresetProps & { defaultDescription?: ReactNode }) {
  const resolvedDescription = description ?? children ?? defaultDescription;

  return (
    <Status.Root {...props}>
      {icon ? <Status.Icon>{icon}</Status.Icon> : null}

      <Status.Content>
        {title ? <Status.Title>{title}</Status.Title> : null}
        {resolvedDescription ? (
          <Status.Description>{resolvedDescription}</Status.Description>
        ) : null}
      </Status.Content>

      {actions ? <Status.Actions>{actions}</Status.Actions> : null}
    </Status.Root>
  );
}

/**
 * Preset for generic empty content states.
 */
function EmptyStatus(props: StatusPresetProps) {
  return (
    <StatusPreset
      defaultDescription="There is nothing to show here yet."
      title="No content yet"
      {...props}
    />
  );
}

/**
 * Preset for generic failure states.
 */
function ErrorStatus(props: StatusPresetProps) {
  return (
    <StatusPreset
      defaultDescription="Something went wrong. Try again in a moment."
      intent="danger"
      title="Something went wrong"
      {...props}
    />
  );
}

/**
 * Preset for 404-style missing page states.
 */
function PageNotFoundStatus(props: StatusPresetProps) {
  return (
    <StatusPreset
      defaultDescription="The page you're looking for doesn't exist or has moved."
      title="Page not found"
      {...props}
    />
  );
}

/**
 * Preset for offline or disconnected states.
 */
function DisconnectedStatus(props: StatusPresetProps) {
  return (
    <StatusPreset
      defaultDescription="You appear to be offline. Reconnect and try again."
      intent="warning"
      title="You're disconnected"
      {...props}
    />
  );
}

/**
 * Preset for empty search/filter result states.
 */
function NoResultsStatus(props: StatusPresetProps) {
  return (
    <StatusPreset
      defaultDescription="No matching items were found. Adjust filters and try again."
      title="No results"
      {...props}
    />
  );
}

/**
 * Preset for authorization and access denial states.
 */
function PermissionDeniedStatus(props: StatusPresetProps) {
  return (
    <StatusPreset
      defaultDescription="You don't have permission to view this content."
      intent="warning"
      title="Permission denied"
      {...props}
    />
  );
}

type StatusCompoundComponent = (<T extends ElementType = 'section'>(
  props: StatusProps<T>
) => JSX.Element) & {
  Root: typeof StatusRoot;
  Icon: typeof StatusIcon;
  Content: typeof StatusContent;
  Title: typeof StatusTitle;
  Description: typeof StatusDescription;
  Actions: typeof StatusActions;
  Empty: typeof EmptyStatus;
  Error: typeof ErrorStatus;
  PageNotFound: typeof PageNotFoundStatus;
  Disconnected: typeof DisconnectedStatus;
  NoResults: typeof NoResultsStatus;
  PermissionDenied: typeof PermissionDeniedStatus;
};

/**
 * Compound status component with composable slots and built-in presets.
 */
export const Status = Object.assign(StatusRoot, {
  Root: StatusRoot,
  Icon: StatusIcon,
  Content: StatusContent,
  Title: StatusTitle,
  Description: StatusDescription,
  Actions: StatusActions,
  Empty: EmptyStatus,
  Error: ErrorStatus,
  PageNotFound: PageNotFoundStatus,
  Disconnected: DisconnectedStatus,
  NoResults: NoResultsStatus,
  PermissionDenied: PermissionDeniedStatus,
}) as StatusCompoundComponent;

export type {
  StatusActionsProps,
  StatusAlign,
  StatusContentProps,
  StatusDensity,
  StatusDescriptionProps,
  StatusIconProps,
  StatusIntent,
  StatusPresetProps,
  StatusProps,
  StatusTitleProps,
  StatusVariant,
};
