import { Heading } from '@themeshift/ui/components/Heading';
import { Fragment, type ReactNode } from 'react';

import { Markdown } from '@/app/components/Markdown';
import type { ApiReferenceItem } from '@/component-data/types';

import styles from './ApiReference.module.scss';

type ApiReferenceProps = {
  emptyState?: ReactNode;
  intro?: ReactNode;
  items: ApiReferenceItem[];
};

type ApiReferenceGroup = {
  displayName: string;
  items: ApiReferenceItem[];
};

const emptyValue = <span className={styles.emptyValue}>-</span>;

const formatValue = (value: string | number | boolean) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return String(value);
};

const formatDefaultValue = (value: ApiReferenceItem['defaultValue']) => {
  if (value === null) {
    return emptyValue;
  }

  return <code>{formatValue(value)}</code>;
};

const formatValues = (values: ApiReferenceItem['values']) => {
  if (!values.length) {
    return emptyValue;
  }

  return (
    <div className={styles.valueList}>
      {values.map((value) => (
        <code className={styles.valueChip} key={String(value)}>
          {formatValue(value)}
        </code>
      ))}
    </div>
  );
};

const groupItems = (items: ApiReferenceItem[]): ApiReferenceGroup[] => {
  const groups = new Map<string, ApiReferenceItem[]>();

  for (const item of items) {
    const group = groups.get(item.displayName);

    if (group) {
      group.push(item);
      continue;
    }

    groups.set(item.displayName, [item]);
  }

  return Array.from(groups.entries()).map(([displayName, group]) => ({
    displayName,
    items: group,
  }));
};

const ApiReferenceTable = ({
  hasGroups,
  groups,
}: {
  groups: ApiReferenceGroup[];
  hasGroups: boolean;
}) => {
  return (
    <div className={styles.tableLayout}>
      {groups.map((group) => (
        <section className={styles.group} key={group.displayName}>
          {hasGroups && (
            <Heading className={styles.groupHeading} level={4}>
              {group.displayName}
            </Heading>
          )}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.propColumn} />
                <col className={styles.typeColumn} />
                <col className={styles.notesColumn} />
                <col className={styles.valuesColumn} />
                <col className={styles.defaultColumn} />
              </colgroup>

              <thead>
                <tr>
                  <th scope="col">Prop</th>
                  <th scope="col">Type</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Values</th>
                  <th scope="col">Default value</th>
                </tr>
              </thead>

              <tbody>
                {group.items.map(
                  ({ comments, defaultValue, propName, type, values }) => (
                    <tr key={propName}>
                      <td className={styles.propCell}>
                        <code>{propName}</code>
                      </td>
                      <td className={styles.typeCell}>
                        <code>{type}</code>
                      </td>
                      <td className={styles.notesCell}>
                        <Markdown
                          className={styles.notes}
                          markdown={comments}
                        />
                      </td>
                      <td className={styles.metaCell}>
                        {formatValues(values)}
                      </td>
                      <td className={styles.metaCell}>
                        {formatDefaultValue(defaultValue)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

const ApiReferenceCards = ({
  hasGroups,
  groups,
}: {
  groups: ApiReferenceGroup[];
  hasGroups: boolean;
}) => {
  return (
    <div className={styles.cardLayout}>
      {groups.map((group) => (
        <section className={styles.group} key={group.displayName}>
          {hasGroups && (
            <Heading className={styles.groupHeading} level={4}>
              {group.displayName}
            </Heading>
          )}

          <div className={styles.cardList}>
            {group.items.map(
              ({ comments, defaultValue, propName, type, values }) => (
                <article className={styles.card} key={propName}>
                  <header className={styles.cardHeader}>
                    <code className={styles.cardProp}>{propName}</code>
                    <code className={styles.cardType}>{type}</code>
                  </header>

                  <Markdown className={styles.notes} markdown={comments} />

                  <dl className={styles.cardMeta}>
                    <div className={styles.cardMetaRow}>
                      <dt>Values</dt>
                      <dd>{formatValues(values)}</dd>
                    </div>

                    <div className={styles.cardMetaRow}>
                      <dt>Default value</dt>
                      <dd>{formatDefaultValue(defaultValue)}</dd>
                    </div>
                  </dl>
                </article>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export const ApiReference = ({
  emptyState,
  intro,
  items,
}: ApiReferenceProps) => {
  if (!items.length) {
    return <>{emptyState ?? null}</>;
  }

  const groups = groupItems(items);
  const hasGroups = groups.length > 1;

  return (
    <Fragment>
      {intro}
      <ApiReferenceTable groups={groups} hasGroups={hasGroups} />
      <ApiReferenceCards groups={groups} hasGroups={hasGroups} />
    </Fragment>
  );
};
