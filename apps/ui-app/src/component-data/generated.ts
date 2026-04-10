import type { ComponentData } from './types';

export const componentData = [
  {
    apiReference: [
      {
        comments:
          'Accessible label for an icon-only button.\n\nRequired when using `icon` without visible text.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'aria-label',
        type: 'string',
        values: [],
      },
      {
        comments:
          'ID of the element that labels an icon-only button.\n\nRequired when using `icon` without visible text.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'aria-labelledby',
        type: 'string',
        values: [],
      },
      {
        comments:
          'Applies Button styles to a single child element instead of rendering a native button.\n\nUse this when pairing Button with routing links or other custom elements.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'asChild',
        type: 'boolean',
        values: [],
      },
      {
        comments: 'Visible button label or content.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'children',
        type: 'ReactNode | ReactElement',
        values: [],
      },
      {
        comments: 'Additional class names for custom styling.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments: 'Icon shown after the button label.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'endIcon',
        type: 'ReactNode',
        values: [],
      },
      {
        comments:
          'Icon-only button content.\n\nFor buttons with text and an icon, use `startIcon` or `endIcon` instead.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'icon',
        type: 'ReactNode',
        values: [],
      },
      {
        comments:
          "Visual style that communicates the action's priority or outcome.",
        defaultValue: 'primary',
        displayName: 'Button',
        propName: 'intent',
        type: 'ButtonIntent',
        values: [
          'primary',
          'secondary',
          'tertiary',
          'constructive',
          'destructive',
        ],
      },
      {
        comments:
          'Shows a spinner while an action is in progress.\n\nAlso adds `aria-busy` for assistive technology.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'isBusy',
        type: 'boolean',
        values: [],
      },
      {
        comments: 'Size option for button spacing and text.',
        defaultValue: 'medium',
        displayName: 'Button',
        propName: 'size',
        type: 'ButtonSize',
        values: ['small', 'medium', 'large'],
      },
      {
        comments: 'Icon shown before the button label.',
        defaultValue: null,
        displayName: 'Button',
        propName: 'startIcon',
        type: 'ReactNode',
        values: [],
      },
      {
        comments:
          'Shows disabled styling without blocking interaction.\n\nUse this when the button should explain why an action is unavailable.',
        defaultValue: false,
        displayName: 'Button',
        propName: 'visuallyDisabled',
        type: 'boolean',
        values: [],
      },
    ],
    component: 'Button',
    importString: "import { Button } from '@themeshift/ui/components/Button';",
    slug: 'button',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/Button',
  },
  {
    apiReference: [
      {
        comments: 'Semantic heading level to render.',
        defaultValue: 1,
        displayName: 'Heading',
        propName: 'level',
        type: 'HeadingLevel',
        values: [1, 2, 3, 4, 5, 6],
      },
      {
        comments: 'Applies the muted heading color treatment.',
        defaultValue: false,
        displayName: 'Heading',
        propName: 'muted',
        type: 'boolean',
        values: [],
      },
    ],
    component: 'Heading',
    importString:
      "import { Heading } from '@themeshift/ui/components/Heading';",
    slug: 'heading',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/Heading',
  },
  {
    apiReference: [
      {
        comments:
          'Applies link styling to a child element instead of rendering an anchor.\n\nExample: `<Link asChild><NavLink to="/docs">Docs</NavLink></Link>`',
        defaultValue: null,
        displayName: 'Link',
        propName: 'asChild',
        type: 'boolean',
        values: [],
      },
      {
        comments: 'Link label or content.',
        defaultValue: null,
        displayName: 'Link',
        propName: 'children',
        type: 'React.ReactNode',
        values: [],
      },
      {
        comments: 'Additional class names to append to the rendered element.',
        defaultValue: null,
        displayName: 'Link',
        propName: 'className',
        type: 'string',
        values: [],
      },
    ],
    component: 'Link',
    importString: "import { Link } from '@themeshift/ui/components/Link';",
    slug: 'link',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/Link',
  },
  {
    apiReference: [
      {
        comments:
          'HTML element or component to render instead of the default element.',
        defaultValue: null,
        displayName: 'Navbar',
        propName: 'as',
        type: 'ElementType',
        values: [],
      },
      {
        comments: 'Navbar content.',
        defaultValue: null,
        displayName: 'Navbar',
        propName: 'children',
        type: 'ReactNode',
        values: [],
      },
      {
        comments: 'Additional class names to append to the root element.',
        defaultValue: null,
        displayName: 'Navbar',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments: 'CSS positioning mode for the navbar wrapper.',
        defaultValue: 'static',
        displayName: 'Navbar',
        propName: 'position',
        type: 'NavbarPosition',
        values: ['static', 'absolute', 'fixed', 'sticky'],
      },
      {
        comments:
          'HTML element or component to render instead of the default element.',
        defaultValue: null,
        displayName: 'Navbar.Container',
        propName: 'as',
        type: 'ElementType',
        values: [],
      },
      {
        comments: 'Container content.',
        defaultValue: null,
        displayName: 'Navbar.Container',
        propName: 'children',
        type: 'ReactNode',
        values: [],
      },
      {
        comments: 'Additional class names to append to the container element.',
        defaultValue: null,
        displayName: 'Navbar.Container',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments:
          'Horizontal gap between container children.\n\nExample: `<Navbar.Container gap="2rem" />`',
        defaultValue: null,
        displayName: 'Navbar.Container',
        propName: 'gap',
        type: "CSSProperties['columnGap']",
        values: [],
      },
      {
        comments:
          'Maximum content width inside the navbar.\n\nExample: `<Navbar.Container maxWidth="72rem" />`',
        defaultValue: null,
        displayName: 'Navbar.Container',
        propName: 'maxWidth',
        type: "CSSProperties['maxWidth']",
        values: [],
      },
      {
        comments: 'Horizontal alignment inside the navbar row.',
        defaultValue: 'start',
        displayName: 'Navbar.Section',
        propName: 'align',
        type: 'NavbarSectionAlign',
        values: ['start', 'center', 'end'],
      },
      {
        comments:
          'HTML element or component to render instead of the default element.',
        defaultValue: null,
        displayName: 'Navbar.Section',
        propName: 'as',
        type: 'ElementType',
        values: [],
      },
      {
        comments: 'Section content.',
        defaultValue: null,
        displayName: 'Navbar.Section',
        propName: 'children',
        type: 'ReactNode',
        values: [],
      },
      {
        comments: 'Additional class names to append to the section element.',
        defaultValue: null,
        displayName: 'Navbar.Section',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments: 'Direction used to lay out section children.',
        defaultValue: 'row',
        displayName: 'Navbar.Section',
        propName: 'direction',
        type: 'NavbarSectionDirection',
        values: ['row', 'column'],
      },
      {
        comments:
          'Gap between section children.\n\nExample: `<Navbar.Section gap="0.75rem" />`',
        defaultValue: null,
        displayName: 'Navbar.Section',
        propName: 'gap',
        type: "CSSProperties['gap']",
        values: [],
      },
      {
        comments: 'Allows section items to wrap onto multiple lines.',
        defaultValue: false,
        displayName: 'Navbar.Section',
        propName: 'wrap',
        type: 'boolean',
        values: [],
      },
    ],
    component: 'Navbar',
    importString: "import { Navbar } from '@themeshift/ui/components/Navbar';",
    slug: 'navbar',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/Navbar',
  },
  {
    apiReference: [
      {
        comments: '',
        defaultValue: null,
        displayName: 'Responsive',
        propName: 'as',
        type: 'ElementType',
        values: [],
      },
      {
        comments: 'Content that should be conditionally shown.',
        defaultValue: null,
        displayName: 'Responsive',
        propName: 'children',
        type: 'ReactNode',
        values: [],
      },
      {
        comments: 'Additional class names to append to the rendered element.',
        defaultValue: null,
        displayName: 'Responsive',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments: 'Breakpoint rule used to control visibility.',
        defaultValue: null,
        displayName: 'Responsive',
        propName: 'when',
        type: 'ResponsiveWhen',
        values: [],
      },
    ],
    component: 'Responsive',
    importString:
      "import { Responsive } from '@themeshift/ui/components/Responsive';",
    slug: 'responsive',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/Responsive',
  },
  {
    apiReference: [
      {
        comments: 'Optional text content for the skip link.',
        defaultValue: null,
        displayName: 'SkipLink',
        propName: 'children',
        type: 'ReactNode',
        values: [],
      },
      {
        comments: 'Additional class names to append to the rendered link.',
        defaultValue: null,
        displayName: 'SkipLink',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments: 'Destination id reference, typically the main landmark.',
        defaultValue: null,
        displayName: 'SkipLink',
        propName: 'href',
        type: 'string',
        values: [],
      },
      {
        comments: 'Optional text label used when `children` is not provided.',
        defaultValue: null,
        displayName: 'SkipLink',
        propName: 'label',
        type: 'string',
        values: [],
      },
    ],
    component: 'SkipLink',
    importString:
      "import { SkipLink } from '@themeshift/ui/components/SkipLink';",
    slug: 'skiplink',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/SkipLink',
  },
  {
    apiReference: [
      {
        comments: '',
        defaultValue: null,
        displayName: 'Spinner',
        propName: 'className',
        type: 'string',
        values: [],
      },
      {
        comments: '',
        defaultValue: 24,
        displayName: 'Spinner',
        propName: 'size',
        type: 'number',
        values: [],
      },
    ],
    component: 'Spinner',
    importString:
      "import { Spinner } from '@themeshift/ui/components/Spinner';",
    slug: 'spinner',
    sourceCodeUrl:
      'https://github.com/adamhutch/themeshift/tree/develop/packages/ui/src/components/Spinner',
  },
] satisfies ComponentData[];
