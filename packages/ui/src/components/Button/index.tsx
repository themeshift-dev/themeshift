import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import {
  Children,
  cloneElement,
  isValidElement,
  type ElementType,
} from 'react';

import { Spinner } from '@/components/Spinner';

import styles from './Button.module.scss';
import type {
  ButtonIntent,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  SlottableChild,
} from './types';

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
  hero: styles.hero,
} satisfies Record<ButtonSize, string>;

const sizeSpinnerMap = {
  small: 12,
  medium: 16,
  large: 20,
  hero: 24,
} satisfies Record<ButtonSize, number>;

const intentClassMap = {
  constructive: styles.constructive,
  destructive: styles.destructive,
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<ButtonIntent, string>;

const variantClassMap = {
  link: styles.variantLink,
  outline: styles.variantOutline,
  solid: styles.variantSolid,
} satisfies Record<ButtonVariant, string>;

/** A theme-aware button with intent, variant, and size options. */
export const Button = <T extends ElementType = 'button'>({
  as,
  asChild = false,
  children,
  className,
  endIcon,
  icon,
  intent = 'primary',
  isBusy,
  size = 'medium',
  startIcon,
  variant = 'solid',
  visuallyDisabled = false,
  ...buttonProps
}: ButtonProps<T>) => {
  const Component = as ?? 'button';
  const childElement =
    asChild && isValidElement(children)
      ? (Children.only(children) as SlottableChild)
      : null;

  if (asChild && !childElement) {
    throw new Error(
      'ThemeShift Button with asChild expects a single React element child.'
    );
  }

  const childContent = childElement?.props.children;
  const contentSource = asChild ? childContent : children;
  const hasChildren = contentSource !== undefined && contentSource !== null;
  const isIconOnly = icon !== undefined && icon !== null;
  const Comp = asChild ? Slot : Component;

  let buttonContent = (
    <>
      {startIcon && <span className={styles.iconSlot}>{startIcon}</span>}
      {hasChildren && <span className={styles.label}>{contentSource}</span>}
      {isBusy && <Spinner size={sizeSpinnerMap[size]} />}
      {endIcon && <span className={styles.iconSlot}>{endIcon}</span>}
    </>
  );

  if (isIconOnly) {
    if (isBusy) {
      buttonContent = <Spinner size={sizeSpinnerMap[size]} />;
    } else {
      buttonContent = <span className={styles.iconSlot}>{icon}</span>;
    }
  }

  const resolvedChildren = childElement
    ? cloneElement(childElement, undefined, buttonContent)
    : buttonContent;

  return (
    <Comp
      {...buttonProps}
      aria-busy={isBusy}
      className={classNames(
        styles.container,
        sizeClassMap[size],
        intentClassMap[intent],
        variantClassMap[variant],
        visuallyDisabled && styles.visuallyDisabled,
        isIconOnly && styles.iconOnly,
        className
      )}
    >
      {resolvedChildren}
    </Comp>
  );
};
