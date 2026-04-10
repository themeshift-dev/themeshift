import { Button } from '@themeshift/ui/components/Button';
import { Heading } from '@themeshift/ui/components/Heading';
import { IconMoon } from '@themeshift/ui/icons/IconMoon';
import { useMemo, useState } from 'react';

import { useAccessibilityAudit } from '@/hooks';

import styles from './AccessibilitySection.module.scss';

const buttonIntentOptions = [
  'primary',
  'secondary',
  'tertiary',
  'constructive',
  'destructive',
] as const;
const buttonSizeOptions = ['small', 'medium', 'large'] as const;

type AccessibilityResultType = 'violations' | 'incomplete' | 'passes';
type ButtonPlaygroundIntent = (typeof buttonIntentOptions)[number];
type ButtonPlaygroundMode = 'text' | 'icon';
type ButtonPlaygroundSize = (typeof buttonSizeOptions)[number];

const accessibilityResultLabels = {
  incomplete: 'Needs review',
  passes: 'Passes',
  violations: 'Violations',
} satisfies Record<AccessibilityResultType, string>;

export const AccessibilitySection = () => {
  const [accessibleName, setAccessibleName] = useState('Toggle theme');
  const [buttonLabel, setButtonLabel] = useState('Click me');
  const [intent, setIntent] = useState<ButtonPlaygroundIntent>('primary');
  const [isBusy, setIsBusy] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [mode, setMode] = useState<ButtonPlaygroundMode>('text');
  const [selectedResultType, setSelectedResultType] =
    useState<AccessibilityResultType>('violations');
  const [size, setSize] = useState<ButtonPlaygroundSize>('medium');

  const accessibilityButton = useMemo(() => {
    if (mode === 'icon') {
      return (
        <Button
          aria-label={accessibleName}
          disabled={isDisabled}
          icon={<IconMoon aria-hidden />}
          intent={intent}
          isBusy={isBusy}
          size={size}
        />
      );
    }

    return (
      <Button disabled={isDisabled} intent={intent} isBusy={isBusy} size={size}>
        {buttonLabel}
      </Button>
    );
  }, [accessibleName, buttonLabel, intent, isBusy, isDisabled, mode, size]);

  const accessibilityDependencies = useMemo(
    () => [accessibleName, buttonLabel, intent, isBusy, isDisabled, mode, size],
    [accessibleName, buttonLabel, intent, isBusy, isDisabled, mode, size]
  );

  const { auditFrame, error, isReady, isRunning, results } =
    useAccessibilityAudit({
      children: accessibilityButton,
      dependencies: accessibilityDependencies,
    });

  const selectedResults = results?.[selectedResultType] ?? [];

  return (
    <>
      <Heading level={3}>Accessibility</Heading>

      <div className={styles.playground}>
        <div className={styles.controls}>
          <label className={styles.field}>
            Button mode
            <select
              onChange={(event) =>
                setMode(event.target.value as ButtonPlaygroundMode)
              }
              value={mode}
            >
              <option value="text">Text button</option>
              <option value="icon">Icon-only button</option>
            </select>
          </label>

          <label className={styles.field}>
            {mode === 'icon' ? 'Accessible name' : 'Button label'}
            <input
              onChange={(event) =>
                mode === 'icon'
                  ? setAccessibleName(event.target.value)
                  : setButtonLabel(event.target.value)
              }
              value={mode === 'icon' ? accessibleName : buttonLabel}
            />
          </label>

          <label className={styles.field}>
            Intent
            <select
              onChange={(event) =>
                setIntent(event.target.value as ButtonPlaygroundIntent)
              }
              value={intent}
            >
              {buttonIntentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Size
            <select
              onChange={(event) =>
                setSize(event.target.value as ButtonPlaygroundSize)
              }
              value={size}
            >
              {buttonSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.checkbox}>
            <input
              checked={isBusy}
              onChange={(event) => setIsBusy(event.target.checked)}
              type="checkbox"
            />
            Busy
          </label>

          <label className={styles.checkbox}>
            <input
              checked={isDisabled}
              onChange={(event) => setIsDisabled(event.target.checked)}
              type="checkbox"
            />
            Disabled
          </label>
        </div>

        <div className={styles.preview}>{accessibilityButton}</div>

        <p className={styles.note}>
          Automated checks catch common issues, but they do not replace keyboard
          and screen reader testing.
        </p>

        <div className={styles.results}>
          <div className={styles.summary}>
            {(
              [
                ['violations', results?.violations.length ?? 0],
                ['incomplete', results?.incomplete.length ?? 0],
                ['passes', results?.passes.length ?? 0],
              ] satisfies [AccessibilityResultType, number][]
            ).map(([resultType, count]) => (
              <button
                aria-pressed={selectedResultType === resultType}
                className={styles.summaryItem}
                key={resultType}
                onClick={() => setSelectedResultType(resultType)}
                type="button"
              >
                {accessibilityResultLabels[resultType]}: {count}
              </button>
            ))}
          </div>

          {error && (
            <p className={styles.status}>
              Accessibility audit failed: {error.message}
            </p>
          )}

          {!error && !isRunning && results && selectedResults.length === 0 && (
            <p className={styles.status}>
              No {accessibilityResultLabels[selectedResultType].toLowerCase()}{' '}
              found.
            </p>
          )}

          {!error && !isRunning && !results && !isReady && (
            <p className={styles.status}>Preparing accessibility audit.</p>
          )}

          {isRunning && !results && (
            <p className={styles.status}>Running accessibility audit.</p>
          )}

          {selectedResults.map((issue) => (
            <article
              className={styles.issue}
              key={`${selectedResultType}-${issue.id}`}
            >
              <div className={styles.issueHeader}>
                <strong>{issue.help}</strong>
                <span className={styles.issueMeta}>
                  {accessibilityResultLabels[selectedResultType]}
                  {issue.impact ? ` / ${issue.impact}` : ''}
                </span>
              </div>

              <p>{issue.description}</p>

              <a href={issue.helpUrl} rel="noreferrer" target="_blank">
                Learn about {issue.id}
              </a>

              <div className={styles.nodes}>
                {issue.nodes.slice(0, 3).map((node, index) => (
                  <code key={`${issue.id}-${index}`}>{node.html}</code>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      {auditFrame}
    </>
  );
};
