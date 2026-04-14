import { Heading } from '@themeshift/ui/components/Heading';
import { Select } from '@themeshift/ui/components/Select';
import { useMemo, useState } from 'react';

import { useAccessibilityAudit } from '@/hooks';

import styles from './AccessibilitySection.module.scss';

const selectSizeOptions = ['small', 'medium', 'large'] as const;
const validationStateOptions = ['none', 'invalid', 'valid', 'warning'] as const;

type AccessibilityResultType = 'violations' | 'incomplete' | 'passes';
type SelectSize = (typeof selectSizeOptions)[number];
type ValidationState = (typeof validationStateOptions)[number];

const accessibilityResultLabels = {
  incomplete: 'Needs review',
  passes: 'Passes',
  violations: 'Violations',
} satisfies Record<AccessibilityResultType, string>;

export const AccessibilitySection = () => {
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [label, setLabel] = useState('Country');
  const [placeholder, setPlaceholder] = useState('Choose a country');
  const [selectedResultType, setSelectedResultType] =
    useState<AccessibilityResultType>('violations');
  const [size, setSize] = useState<SelectSize>('medium');
  const [validationState, setValidationState] =
    useState<ValidationState>('none');

  const accessibilityInput = useMemo(
    () => (
      <Select
        aria-label={label}
        defaultValue=""
        disabled={disabled}
        fullWidth={fullWidth}
        options={[
          { label: 'Canada', value: 'ca' },
          { label: 'United States', value: 'us' },
          { label: 'Mexico', value: 'mx' },
        ]}
        placeholder={placeholder}
        size={size}
        validationState={validationState}
      />
    ),
    [disabled, fullWidth, label, placeholder, size, validationState]
  );

  const accessibilityDependencies = useMemo(
    () => [disabled, fullWidth, label, placeholder, size, validationState],
    [disabled, fullWidth, label, placeholder, size, validationState]
  );

  const { error, isReady, isRunning, results } = useAccessibilityAudit({
    children: accessibilityInput,
    dependencies: accessibilityDependencies,
  });

  const selectedResults = results?.[selectedResultType] ?? [];

  return (
    <>
      <Heading level={3}>Accessibility</Heading>

      <div className={styles.playground}>
        <div className={styles.controls}>
          <label className={styles.field}>
            Accessible label
            <input
              onChange={(event) => setLabel(event.target.value)}
              value={label}
            />
          </label>

          <label className={styles.field}>
            Placeholder
            <input
              onChange={(event) => setPlaceholder(event.target.value)}
              value={placeholder}
            />
          </label>

          <label className={styles.field}>
            Size
            <select
              onChange={(event) => setSize(event.target.value as SelectSize)}
              value={size}
            >
              {selectSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Validation state
            <select
              onChange={(event) =>
                setValidationState(event.target.value as ValidationState)
              }
              value={validationState}
            >
              {validationStateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.checkbox}>
            <input
              checked={fullWidth}
              onChange={(event) => setFullWidth(event.target.checked)}
              type="checkbox"
            />
            Full width
          </label>

          <label className={styles.checkbox}>
            <input
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
              type="checkbox"
            />
            Disabled
          </label>
        </div>

        <div className={styles.preview}>{accessibilityInput}</div>

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
    </>
  );
};
