import {
  BasicObserverDemo,
  BoxOptionDemo,
  DynamicTargetDemo,
  UnsupportedFallbackDemo,
} from './demos';

export const basicUsage = {
  code: `import { useResizeObserver } from '@themeshift/ui/hooks/useResizeObserver';

export const SizeAwarePanel = () => {
  const { ref, rect } = useResizeObserver();

  return (
    <div>
      <div ref={ref}>Observed content</div>
      <p>{rect ? \`\${rect.width} x \${rect.height}\` : 'No measurement yet'}</p>
    </div>
  );
};`,
  label: 'Basic usage',
  sample: () => <BasicObserverDemo />,
};

export const dynamicTarget = {
  code: `const { ref, rect } = useResizeObserver();

<div ref={isLeftActive ? ref : undefined}>Left target</div>
<div ref={isLeftActive ? undefined : ref}>Right target</div>
<p>{rect?.width}</p>;`,
  label: 'Dynamic target swapping',
  sample: () => <DynamicTargetDemo />,
};

export const boxOption = {
  code: `const observer = useResizeObserver({ box: 'border-box' });

<div ref={observer.ref}>Observed with border-box</div>
<p>{observer.rect?.width}</p>;`,
  label: 'Box option',
  sample: () => <BoxOptionDemo />,
};

export const unsupportedFallback = {
  code: `const { isSupported, rect, ref } = useResizeObserver();

if (!isSupported) {
  return <p>ResizeObserver is unavailable in this environment.</p>;
}

return <div ref={ref}>{rect?.width}</div>;`,
  label: 'Unsupported fallback',
  sample: () => <UnsupportedFallbackDemo />,
};

export const commonUseCases = [
  basicUsage,
  dynamicTarget,
  boxOption,
  unsupportedFallback,
];
