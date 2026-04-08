import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

/** Shared polymorphic prop helper used by the navbar components. */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  /** HTML element or component to render instead of the default element. */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

/** Supported positioning modes for the root navbar element. */
export type NavbarPosition = 'static' | 'absolute' | 'fixed' | 'sticky';

/** Horizontal alignment options for a navbar section. */
export type NavbarSectionAlign = 'start' | 'center' | 'end';

/** Layout direction options for a navbar section. */
export type NavbarSectionDirection = 'row' | 'column';

/** CSS custom properties used internally by navbar layout components. */
export type CSSVarStyle = CSSProperties & {
  '--navbar-container-gap'?: CSSProperties['columnGap'];
  '--navbar-max-width'?: CSSProperties['maxWidth'];
  '--navbar-section-gap'?: CSSProperties['gap'];
};

/** Shared props for the root navbar wrapper. */
export type NavbarOwnProps = {
  /** Navbar content. */
  children?: ReactNode;
  /** Additional class names to append to the root element. */
  className?: string;
  /** CSS positioning mode for the navbar wrapper. */
  position?: NavbarPosition;
};

/** Props for the navbar content container. */
export type NavbarContainerOwnProps = {
  /** Container content. */
  children?: ReactNode;
  /** Additional class names to append to the container element. */
  className?: string;
  /**
   * Horizontal gap between container children.
   *
   * Example: `<Navbar.Container gap="2rem" />`
   */
  gap?: CSSProperties['columnGap'];
  /**
   * Maximum content width inside the navbar.
   *
   * Example: `<Navbar.Container maxWidth="72rem" />`
   */
  maxWidth?: CSSProperties['maxWidth'];
};

/** Props for a navbar section. */
export type NavbarSectionOwnProps = {
  /** Horizontal alignment inside the navbar row. */
  align?: NavbarSectionAlign;
  /** Section content. */
  children?: ReactNode;
  /** Additional class names to append to the section element. */
  className?: string;
  /** Direction used to lay out section children. */
  direction?: NavbarSectionDirection;
  /**
   * Gap between section children.
   *
   * Example: `<Navbar.Section gap="0.75rem" />`
   */
  gap?: CSSProperties['gap'];
  /** Allows section items to wrap onto multiple lines. */
  wrap?: boolean;
};

/** Props for the root navbar component. */
export type NavbarProps<T extends ElementType = 'nav'> = PolymorphicProps<
  T,
  NavbarOwnProps
>;

/** Props for the navbar container subcomponent. */
export type NavbarContainerProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  NavbarContainerOwnProps
>;

/** Props for the navbar section subcomponent. */
export type NavbarSectionProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  NavbarSectionOwnProps
>;
