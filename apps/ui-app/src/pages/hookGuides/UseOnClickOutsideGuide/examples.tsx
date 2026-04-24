import {
  BasicOutsideClickDemo,
  CallbackFreshStateDemo,
  CustomEventTypeDemo,
} from './demos';

export const basicUsage = {
  code: `import { useOnClickOutside } from '@themeshift/ui/hooks/useOnClickOutside';
import { useRef } from 'react';

export const DismissiblePanel = () => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    console.log('Clicked outside');
  });

  return <div ref={ref}>Panel content</div>;
};`,
  label: 'Basic usage',
  sample: () => <BasicOutsideClickDemo />,
};

export const customEventType = {
  code: `const containerRef = useRef<HTMLDivElement>(null);

useOnClickOutside(
  containerRef,
  () => {
    console.log('Focus moved outside');
  },
  'focusin'
);`,
  label: 'Custom event type',
  sample: () => <CustomEventTypeDemo />,
};

export const callbackFreshState = {
  code: `const panelRef = useRef<HTMLDivElement>(null);
const [outsideCount, setOutsideCount] = useState(0);

useOnClickOutside(panelRef, () => {
  setOutsideCount((value) => value + 1);
});`,
  label: 'Fresh callback state',
  sample: () => <CallbackFreshStateDemo />,
};

export const commonUseCases = [basicUsage, customEventType, callbackFreshState];
