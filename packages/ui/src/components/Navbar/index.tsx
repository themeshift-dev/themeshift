/* eslint-disable react-refresh/only-export-components */
import type { ElementType } from 'react';

import { NavbarContainer } from './components/NavbarContainer';
import { NavbarRoot } from './components/NavbarRoot';
import { NavbarSection } from './components/NavbarSection';
import type {
  NavbarContainerProps,
  NavbarProps,
  NavbarSectionProps,
} from './components/types';

/** Compound navbar component with container and section subcomponents. */
type NavbarComponent = (<T extends ElementType = 'nav'>(
  props: NavbarProps<T>,
) => React.JSX.Element) & {
  /** Layout wrapper used to constrain navbar content. */
  Container: typeof NavbarContainer;
  /** Horizontal slot used to align navbar content. */
  Section: typeof NavbarSection;
};

/** A compound navigation bar component with container and section helpers. */
export const Navbar = Object.assign(NavbarRoot, {
  Container: NavbarContainer,
  Section: NavbarSection,
}) as NavbarComponent;

export { NavbarContainer, NavbarRoot, NavbarSection };
export type { NavbarContainerProps, NavbarProps, NavbarSectionProps };
