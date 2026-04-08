import { NavLink } from 'react-router';
import {
  Link as ThemeShiftLink,
  type LinkProps as ThemeShiftLinkProps,
} from '@themeshift/ui/components/Link';

const EXTERNAL_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const EXTERNAL_PROTOCOL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)/i;

function isExternalLinkTarget(to: string) {
  return EXTERNAL_URL_PATTERN.test(to) || EXTERNAL_PROTOCOL_PATTERN.test(to);
}

type AppLinkProps = {
  to: string;
  end?: boolean;
} & Omit<ThemeShiftLinkProps, 'asChild' | 'href'>;

export const Link = ({ className, end, to, ...props }: AppLinkProps) => {
  if (isExternalLinkTarget(to)) {
    return <ThemeShiftLink {...props} className={className} href={to} />;
  }

  return (
    <ThemeShiftLink asChild className={className}>
      <NavLink {...props} end={end} to={to} />
    </ThemeShiftLink>
  );
};
