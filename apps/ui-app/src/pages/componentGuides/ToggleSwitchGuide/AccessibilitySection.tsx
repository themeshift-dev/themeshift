import { Heading } from '@themeshift/ui/components/Heading';
import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { IconMoon, IconSun } from '@themeshift/ui/icons';
import { useMemo, useState } from 'react';

import { useAccessibilityAudit } from '@/hooks';

import styles from './AccessibilitySection.module.scss';

const toggleIntentOptions = [
  'primary',
  'secondary',
  'tertiary',
  'constructive',
  'destructive',
] as const;
const toggleSizeOptions = ['small', 'medium', 'large'] as const;

type AccessibilityResultType = 'violations' | 'incomplete' | 'passes';
type ToggleIntent = (typeof toggleIntentOptions)[number];
type ToggleSize = (typeof toggleSizeOptions)[number];

const accessibilityResultLabels = {
  incomplete: 'Needs review',
  passes: 'Passes',
  violations: 'Violations',
} satisfies Record<AccessibilityResultType, string>;

export const AccessibilitySection = () => {
  const [description, setDescription] = useState(
    'Enable automatic theme changes.'
  );
  const [intent, setIntent] = useState<ToggleIntent>('primary');
  const [invalid, setInvalid] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [label, setLabel] = useState('Theme mode');
  const [readOnly, setReadOnly] = useState(false);
  const [selectedResultType, setSelectedResultType] =
    useState<AccessibilityResultType>('violations');
  const [showIcons, setShowIcons] = useState(true);
  const [size, setSize] = useState<ToggleSize>('medium');

  const accessibilityToggle = useMemo(
    () => (
      <ToggleSwitch
        aria-invalid={invalid || undefined}
        checked={isChecked}
        description={description}
        errorMessage={
          invalid ? 'Resolve the conflicting preference.' : undefined
        }
        iconOff={showIcons ? <IconMoon aria-hidden /> : undefined}
        iconOn={showIcons ? <IconSun aria-hidden /> : undefined}
        intent={intent}
        label={label}
        onCheckedChange={setIsChecked}
        readOnly={readOnly}
        disabled={isDisabled}
        size={size}
      />
    ),
    [
      description,
      intent,
      invalid,
      isChecked,
      isDisabled,
      label,
      readOnly,
      showIcons,
      size,
    ]
  );

  const accessibilityDependencies = useMemo(
    () => [
      description,
      intent,
      invalid,
      isChecked,
      isDisabled,
      label,
      readOnly,
      showIcons,
      size,
    ],
    [
      description,
      intent,
      invalid,
      isChecked,
      isDisabled,
      label,
      readOnly,
      showIcons,
      size,
    ]
  );

  const { auditFrame, error, isReady, isRunning, results } =
    useAccessibilityAudit({
      children: accessibilityToggle,
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
            Description
            <input
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          <label className={styles.field}>
            Intent
            <select
              onChange={(event) =>
                setIntent(event.target.value as ToggleIntent)
              }
              value={intent}
            >
              {toggleIntentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Size
            <select
              onChange={(event) => setSize(event.target.value as ToggleSize)}
              value={size}
            >
              {toggleSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.checkbox}>
            <input
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
              type="checkbox"
            />
            Checked
          </label>

          <label className={styles.checkbox}>
            <input
              checked={invalid}
              onChange={(event) => setInvalid(event.target.checked)}
              type="checkbox"
            />
            Invalid
          </label>

          <label className={styles.checkbox}>
            <input
              checked={isDisabled}
              onChange={(event) => setIsDisabled(event.target.checked)}
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

          <label className={styles.checkbox}>
            <input
              checked={showIcons}
              onChange={(event) => setShowIcons(event.target.checked)}
              type="checkbox"
            />
            Show icons
          </label>
        </div>

        <div className={styles.preview}>{accessibilityToggle}</div>

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
