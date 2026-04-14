import { Field } from '@themeshift/ui/components/Field';
import { Heading } from '@themeshift/ui/components/Heading';
import { Input } from '@themeshift/ui/components/Input';
import { useMemo, useState } from 'react';

import { useAccessibilityAudit } from '@/hooks';

import styles from './AccessibilitySection.module.scss';

const validationStateOptions = ['none', 'invalid', 'valid', 'warning'] as const;

type AccessibilityResultType = 'violations' | 'incomplete' | 'passes';
type ValidationState = (typeof validationStateOptions)[number];

const accessibilityResultLabels = {
  incomplete: 'Needs review',
  passes: 'Passes',
  violations: 'Violations',
} satisfies Record<AccessibilityResultType, string>;

export const AccessibilitySection = () => {
  const [description, setDescription] = useState(
    "We'll only use this for account updates."
  );
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('Please enter a valid email address.');
  const [hideLabel, setHideLabel] = useState(false);
  const [label, setLabel] = useState('Email address');
  const [optional, setOptional] = useState(false);
  const [placeholder, setPlaceholder] = useState('you@example.com');
  const [readOnly, setReadOnly] = useState(false);
  const [required, setRequired] = useState(false);
  const [selectedResultType, setSelectedResultType] =
    useState<AccessibilityResultType>('violations');
  const [showDescription, setShowDescription] = useState(true);
  const [showError, setShowError] = useState(true);
  const [validationState, setValidationState] =
    useState<ValidationState>('none');

  const accessibilityInput = useMemo(
    () => (
      <Field
        description={showDescription ? description : undefined}
        disabled={disabled}
        error={showError ? error : undefined}
        hideLabel={hideLabel}
        label={label}
        optional={optional}
        readOnly={readOnly}
        required={required}
        validationState={validationState}
      >
        <Input placeholder={placeholder} type="email" />
      </Field>
    ),
    [
      description,
      disabled,
      error,
      hideLabel,
      label,
      optional,
      placeholder,
      readOnly,
      required,
      showDescription,
      showError,
      validationState,
    ]
  );

  const accessibilityDependencies = useMemo(
    () => [
      description,
      disabled,
      error,
      hideLabel,
      label,
      optional,
      placeholder,
      readOnly,
      required,
      showDescription,
      showError,
      validationState,
    ],
    [
      description,
      disabled,
      error,
      hideLabel,
      label,
      optional,
      placeholder,
      readOnly,
      required,
      showDescription,
      showError,
      validationState,
    ]
  );

  const {
    error: auditError,
    isReady,
    isRunning,
    results,
  } = useAccessibilityAudit({
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
            Label
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
            Description
            <input
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          <label className={styles.field}>
            Error
            <input
              onChange={(event) => setError(event.target.value)}
              value={error}
            />
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
              checked={showDescription}
              onChange={(event) => setShowDescription(event.target.checked)}
              type="checkbox"
            />
            Show description
          </label>

          <label className={styles.checkbox}>
            <input
              checked={showError}
              onChange={(event) => setShowError(event.target.checked)}
              type="checkbox"
            />
            Show error text
          </label>

          <label className={styles.checkbox}>
            <input
              checked={required}
              onChange={(event) => setRequired(event.target.checked)}
              type="checkbox"
            />
            Required
          </label>

          <label className={styles.checkbox}>
            <input
              checked={optional}
              onChange={(event) => setOptional(event.target.checked)}
              type="checkbox"
            />
            Optional indicator
          </label>

          <label className={styles.checkbox}>
            <input
              checked={hideLabel}
              onChange={(event) => setHideLabel(event.target.checked)}
              type="checkbox"
            />
            Hide label visually
          </label>

          <label className={styles.checkbox}>
            <input
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
              type="checkbox"
            />
            Disabled
          </label>

          <label className={styles.checkbox}>
            <input
              checked={readOnly}
              onChange={(event) => setReadOnly(event.target.checked)}
              type="checkbox"
            />
            Read only
          </label>
        </div>

        <div className={styles.preview}>{accessibilityInput}</div>

        <p className={styles.note}>
          Keep announcements calm for inline validation. This demo uses the
          Field default <code>role="status"</code> for error content.
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

          {auditError && (
            <p className={styles.status}>
              Accessibility audit failed: {auditError.message}
            </p>
          )}

          {!auditError &&
            !isRunning &&
            results &&
            selectedResults.length === 0 && (
              <p className={styles.status}>
                No {accessibilityResultLabels[selectedResultType].toLowerCase()}{' '}
                found.
              </p>
            )}

          {!auditError && !isRunning && !results && !isReady && (
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
