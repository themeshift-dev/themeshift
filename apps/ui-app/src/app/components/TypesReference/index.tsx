import { Heading } from '@themeshift/ui/components/Heading';
import { Fragment, type ReactNode } from 'react';

import type { TypesReferenceItem } from '@/apiReference';
import { Markdown } from '@/app/components/Markdown';
import { TableOfContents } from '@/app/components/TableOfContents';

import styles from './TypesReference.module.scss';

type TypesReferenceProps = {
  emptyState?: ReactNode;
  intro?: ReactNode;
  items: TypesReferenceItem[];
};

type TypesReferenceGroup = {
  displayName: string;
  items: TypesReferenceItem[];
};

const getGroupMarkerId = (displayName: string) =>
  `types-reference-${displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;

const emptyValue = <span className={styles.emptyValue}>-</span>;

const formatValue = (value: string | number | boolean) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return String(value);
};

const formatDefaultValue = (value: TypesReferenceItem['defaultValue']) => {
  if (value === null) {
    return emptyValue;
  }

  return <code>{formatValue(value)}</code>;
};

const formatValues = (values: TypesReferenceItem['values']) => {
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

const groupItems = (items: TypesReferenceItem[]): TypesReferenceGroup[] => {
  const groups = new Map<string, TypesReferenceItem[]>();

  for (const item of items) {
    const displayName = item.displayName ?? 'Types';
    const group = groups.get(displayName);

    if (group) {
      group.push(item);
      continue;
    }

    groups.set(displayName, [item]);
  }

  return Array.from(groups.entries()).map(([displayName, group]) => ({
    displayName,
    items: group,
  }));
};

const TypesReferenceTable = ({
  groups,
  hasGroups,
}: {
  groups: TypesReferenceGroup[];
  hasGroups: boolean;
}) => {
  return (
    <div className={styles.tableLayout}>
      {groups.map((group) => (
        <section className={styles.group} key={group.displayName}>
          {hasGroups && (
            <TableOfContents.Marker
              id={getGroupMarkerId(group.displayName)}
              label={group.displayName}
              level={2}
            />
          )}

          {hasGroups && (
            <Heading className={styles.groupHeading} level={4}>
              {group.displayName}
            </Heading>
          )}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.typeNameColumn} />
                <col className={styles.notesColumn} />
                <col className={styles.valuesColumn} />
                <col className={styles.defaultColumn} />
              </colgroup>

              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Values</th>
                  <th scope="col">Default value</th>
                </tr>
              </thead>

              <tbody>
                {group.items.map(
                  ({ comments, defaultValue, typeName, values }) => (
                    <tr key={typeName}>
                      <td className={styles.typeNameCell}>
                        <code>{typeName}</code>
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

const TypesReferenceCards = ({
  groups,
  hasGroups,
}: {
  groups: TypesReferenceGroup[];
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
            {group.items.map(({ comments, defaultValue, typeName, values }) => (
              <article className={styles.card} key={typeName}>
                <header className={styles.cardHeader}>
                  <code className={styles.cardTypeName}>{typeName}</code>
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
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export const TypesReference = ({
  emptyState,
  intro,
  items,
}: TypesReferenceProps) => {
  if (!items.length) {
    return <>{emptyState ?? null}</>;
  }

  const groups = groupItems(items);
  const hasGroups = groups.length > 1;

  return (
    <Fragment>
      {intro}
      <TypesReferenceTable groups={groups} hasGroups={hasGroups} />
      <TypesReferenceCards groups={groups} hasGroups={hasGroups} />
    </Fragment>
  );
};
