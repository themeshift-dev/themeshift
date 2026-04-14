import { Heading } from '@themeshift/ui/components/Heading';
import { Textarea } from '@themeshift/ui/components/Textarea';
import { useMemo, useState } from 'react';

import { useAccessibilityAudit } from '@/hooks';

import styles from './AccessibilitySection.module.scss';

const textareaResizeOptions = [
  'none',
  'vertical',
  'horizontal',
  'both',
  'auto',
] as const;
const textareaSizeOptions = ['small', 'medium', 'large'] as const;
const validationStateOptions = ['none', 'invalid', 'valid', 'warning'] as const;

type AccessibilityResultType = 'violations' | 'incomplete' | 'passes';
type TextareaResize = (typeof textareaResizeOptions)[number];
type TextareaSize = (typeof textareaSizeOptions)[number];
type ValidationState = (typeof validationStateOptions)[number];

const accessibilityResultLabels = {
  incomplete: 'Needs review',
  passes: 'Passes',
  violations: 'Violations',
} satisfies Record<AccessibilityResultType, string>;

export const AccessibilitySection = () => {
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [label, setLabel] = useState('Project notes');
  const [placeholder, setPlaceholder] = useState('Add implementation details.');
  const [resize, setResize] = useState<TextareaResize>('vertical');
  const [selectedResultType, setSelectedResultType] =
    useState<AccessibilityResultType>('violations');
  const [size, setSize] = useState<TextareaSize>('medium');
  const [validationState, setValidationState] =
    useState<ValidationState>('none');

  const accessibilityTextarea = useMemo(
    () => (
      <Textarea
        aria-label={label}
        disabled={disabled}
        fullWidth={fullWidth}
        maxRows={resize === 'auto' ? 6 : undefined}
        minRows={resize === 'auto' ? 2 : undefined}
        placeholder={placeholder}
        resize={resize}
        size={size}
        validationState={validationState}
      />
    ),
    [disabled, fullWidth, label, placeholder, resize, size, validationState]
  );

  const accessibilityDependencies = useMemo(
    () => [
      disabled,
      fullWidth,
      label,
      placeholder,
      resize,
      size,
      validationState,
    ],
    [disabled, fullWidth, label, placeholder, resize, size, validationState]
  );

  const { auditFrame, error, isReady, isRunning, results } =
    useAccessibilityAudit({
      children: accessibilityTextarea,
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
              onChange={(event) => setSize(event.target.value as TextareaSize)}
              value={size}
            >
              {textareaSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Resize
            <select
              onChange={(event) =>
                setResize(event.target.value as TextareaResize)
              }
              value={resize}
            >
              {textareaResizeOptions.map((option) => (
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

        <div className={styles.preview}>{accessibilityTextarea}</div>

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
