import { Button } from '@themeshift/ui/components/Button';
import { Table } from '@themeshift/ui/components/Table';

type InvoiceRow = {
  amount: number;
  id: string;
  owner: string;
  status: string;
};

const invoices: InvoiceRow[] = [
  { amount: 250, id: 'INV-001', owner: 'Avery', status: 'Paid' },
  { amount: 512.5, id: 'INV-002', owner: 'Jordan', status: 'Pending' },
  { amount: 128.99, id: 'INV-003', owner: 'Taylor', status: 'Overdue' },
];

type PayoutRow = {
  amount: number;
  owner: string;
  status: string;
  submittedAt: string;
  team: string;
};

const payouts: PayoutRow[] = [
  {
    amount: 1840.2,
    owner: 'Avery',
    status: 'Ready',
    submittedAt: '2026-04-10',
    team: 'Design systems',
  },
  {
    amount: 640.0,
    owner: 'Jordan',
    status: 'Review',
    submittedAt: '2026-04-12',
    team: 'Growth',
  },
  {
    amount: 250.75,
    owner: 'Taylor',
    status: 'Blocked',
    submittedAt: '2026-04-14',
    team: 'Finance ops',
  },
];

export const basicUsage = {
  code: `<Table caption="Recent invoices">
  <Table.Head>
    <Table.Row>
      <Table.Header scope="col">Invoice</Table.Header>
      <Table.Header scope="col">Status</Table.Header>
      <Table.Header align="end" scope="col">Amount</Table.Header>
    </Table.Row>
  </Table.Head>

  <Table.Body>
    <Table.Row>
      <Table.Data>INV-001</Table.Data>
      <Table.Data>Paid</Table.Data>
      <Table.Data align="end">$250.00</Table.Data>
    </Table.Row>
  </Table.Body>
</Table>`,
  label: 'Basic usage',
  sample: (
    <Table caption="Recent invoices">
      <Table.Head>
        <Table.Row>
          <Table.Header scope="col">Invoice</Table.Header>
          <Table.Header scope="col">Status</Table.Header>
          <Table.Header align="end" scope="col">
            Amount
          </Table.Header>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        <Table.Row>
          <Table.Data>INV-001</Table.Data>
          <Table.Data>Paid</Table.Data>
          <Table.Data align="end">$250.00</Table.Data>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const dataMode = {
  code: `const rows = [
  { id: 'INV-001', status: 'Paid', amount: 250 },
  { id: 'INV-002', status: 'Pending', amount: 512.5 },
];

<Table
  caption="Recent invoices"
  columns={[
    { key: 'invoice', header: 'Invoice', accessor: 'id' },
    { key: 'status', header: 'Status', accessor: 'status' },
    {
      key: 'amount',
      header: 'Amount',
      accessor: 'amount',
      align: 'end',
      render: (value) => '$' + Number(value).toFixed(2),
    },
  ]}
  data={rows}
/>`,
  label: 'Data mode',
  sample: (
    <Table
      caption="Recent invoices"
      columns={[
        { key: 'invoice', header: 'Invoice', accessor: 'id' },
        { key: 'status', header: 'Status', accessor: 'status' },
        {
          key: 'amount',
          header: 'Amount',
          accessor: 'amount',
          align: 'end',
          render: (value) => `$${Number(value).toFixed(2)}`,
        },
      ]}
      data={invoices}
    />
  ),
};

export const containerScroll = {
  code: `<Table.Container label="Scrollable invoice table" scroll="horizontal">
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Header>Invoice</Table.Header>
        <Table.Header>Owner</Table.Header>
        <Table.Header>Status</Table.Header>
        <Table.Header align="end">Amount</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>{/* rows */}</Table.Body>
  </Table>
</Table.Container>`,
  label: 'Container scroll',
  sample: (
    <Table.Container label="Scrollable invoice table" scroll="horizontal">
      <Table style={{ minWidth: 680 }}>
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Owner</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Last update</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {invoices.map((row, index) => (
            <Table.Row key={row.id}>
              <Table.Data>{row.id}</Table.Data>
              <Table.Data>{row.owner}</Table.Data>
              <Table.Data>{row.status}</Table.Data>
              <Table.Data>{`2026-04-${10 + index}`}</Table.Data>
              <Table.Data align="end">${row.amount.toFixed(2)}</Table.Data>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
  ),
};

export const responsiveScrollMobile = {
  code: `<Table
  caption="Recent payouts"
  responsive="scroll"
  responsiveBreakpoint="mobile"
  columns={[
    { key: 'owner', header: 'Owner', accessor: 'owner' },
    { key: 'team', header: 'Team', accessor: 'team' },
    { key: 'submittedAt', header: 'Submitted', accessor: 'submittedAt' },
    {
      key: 'amount',
      header: 'Amount',
      accessor: 'amount',
      align: 'end',
      render: (value) => '$' + Number(value).toFixed(2),
    },
  ]}
  data={rows}
/>`,
  label: 'Responsive scroll (mobile)',
  sample: (
    <Table
      caption="Recent payouts"
      responsive="scroll"
      responsiveBreakpoint="mobile"
      columns={[
        { key: 'owner', header: 'Owner', accessor: 'owner' },
        { key: 'team', header: 'Team', accessor: 'team' },
        { key: 'submittedAt', header: 'Submitted', accessor: 'submittedAt' },
        {
          key: 'amount',
          header: 'Amount',
          accessor: 'amount',
          align: 'end',
          render: (value) => `$${Number(value).toFixed(2)}`,
        },
      ]}
      data={payouts}
    />
  ),
};

export const responsiveScrollTablet = {
  code: `<Table
  caption="Recent payouts"
  responsive="scroll"
  responsiveBreakpoint="tablet"
  columns={[
    { key: 'owner', header: 'Owner', accessor: 'owner' },
    { key: 'team', header: 'Team', accessor: 'team' },
    { key: 'submittedAt', header: 'Submitted', accessor: 'submittedAt' },
    {
      key: 'amount',
      header: 'Amount',
      accessor: 'amount',
      align: 'end',
      render: (value) => '$' + Number(value).toFixed(2),
    },
  ]}
  data={rows}
/>`,
  label: 'Responsive scroll (tablet)',
  sample: (
    <Table
      caption="Recent payouts"
      responsive="scroll"
      responsiveBreakpoint="tablet"
      columns={[
        { key: 'owner', header: 'Owner', accessor: 'owner' },
        { key: 'team', header: 'Team', accessor: 'team' },
        { key: 'submittedAt', header: 'Submitted', accessor: 'submittedAt' },
        {
          key: 'amount',
          header: 'Amount',
          accessor: 'amount',
          align: 'end',
          render: (value) => `$${Number(value).toFixed(2)}`,
        },
      ]}
      data={payouts}
    />
  ),
};

export const responsiveColumnVisibility = {
  code: `<Table
  caption="Team payouts"
  columns={[
    { key: 'owner', header: 'Owner', accessor: 'owner' },
    { key: 'team', header: 'Team', accessor: 'team', hideBelow: 'tablet' },
    {
      key: 'submittedAt',
      header: 'Submitted',
      accessor: 'submittedAt',
      hideBelow: 'desktop',
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: 'amount',
      align: 'end',
      render: (value) => '$' + Number(value).toFixed(2),
    },
  ]}
  data={rows}
/>`,
  label: 'Column visibility',
  sample: (
    <Table
      caption="Team payouts"
      columns={[
        { key: 'owner', header: 'Owner', accessor: 'owner' },
        { key: 'team', header: 'Team', accessor: 'team', hideBelow: 'tablet' },
        {
          key: 'submittedAt',
          header: 'Submitted',
          accessor: 'submittedAt',
          hideBelow: 'desktop',
        },
        {
          key: 'amount',
          header: 'Amount',
          accessor: 'amount',
          align: 'end',
          render: (value) => `$${Number(value).toFixed(2)}`,
        },
      ]}
      data={payouts}
    />
  ),
};

export const emptyState = {
  code: `<Table
  caption="Archived invoices"
  columns={[
    { key: 'invoice', header: 'Invoice' },
    { key: 'status', header: 'Status' },
  ]}
  data={[]}
  emptyState={
    <Table.Empty
      title="No archived invoices"
      description="When data is available it will appear here."
    />
  }
/>`,
  label: 'Empty state',
  sample: (
    <Table
      caption="Archived invoices"
      columns={[
        { key: 'invoice', header: 'Invoice' },
        { key: 'status', header: 'Status' },
      ]}
      data={[]}
      emptyState={
        <Table.Empty
          title="No archived invoices"
          description="When data is available it will appear here."
        />
      }
    />
  ),
};

export const alignmentAndTruncation = {
  code: `<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Invoice</Table.Header>
      <Table.Header>Notes</Table.Header>
      <Table.Header align="end">Amount</Table.Header>
    </Table.Row>
  </Table.Head>

  <Table.Body>
    <Table.Row>
      <Table.Data>INV-108</Table.Data>
      <Table.Data maxWidth={220} truncate>
        Payment linked to procurement and cross-team approvals.
      </Table.Data>
      <Table.Data align="end" nowrap>$9,520.12</Table.Data>
    </Table.Row>
  </Table.Body>
</Table>`,
  label: 'Alignment and truncation',
  sample: (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Invoice</Table.Header>
          <Table.Header>Notes</Table.Header>
          <Table.Header align="end">Amount</Table.Header>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        <Table.Row>
          <Table.Data>INV-108</Table.Data>
          <Table.Data maxWidth={220} truncate>
            Payment linked to procurement and cross-team approvals.
          </Table.Data>
          <Table.Data align="end" nowrap>
            $9,520.12
          </Table.Data>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const sizes = {
  code: `<Table size="small">
  <Table.Head>
    <Table.Row>
      <Table.Header>Invoice</Table.Header>
      <Table.Header>Status</Table.Header>
      <Table.Header align="end">Amount</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Data>INV-001</Table.Data>
      <Table.Data>Paid</Table.Data>
      <Table.Data align="end">$250.00</Table.Data>
    </Table.Row>
  </Table.Body>
</Table>

<Table size="medium">{/* same structure */}</Table>
<Table size="large">{/* same structure */}</Table>`,
  label: 'Sizes',
  sample: (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Table caption="Small table" size="small">
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>Paid</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table caption="Medium table" size="medium">
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>Paid</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table caption="Large table" size="large">
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>Paid</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};

export const density = {
  code: `<Table density="compact">
  <Table.Head>
    <Table.Row>
      <Table.Header>Invoice</Table.Header>
      <Table.Header>Status</Table.Header>
      <Table.Header align="end">Amount</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Data>INV-001</Table.Data>
      <Table.Data>Paid</Table.Data>
      <Table.Data align="end">$250.00</Table.Data>
    </Table.Row>
  </Table.Body>
</Table>

<Table density="comfortable">{/* same structure */}</Table>
<Table density="spacious">{/* same structure */}</Table>`,
  label: 'Density',
  sample: (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Table caption="Compact density" density="compact">
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>Paid</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table caption="Comfortable density" density="comfortable">
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>Paid</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table caption="Spacious density" density="spacious">
        <Table.Head>
          <Table.Row>
            <Table.Header>Invoice</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header align="end">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Data>INV-001</Table.Data>
            <Table.Data>Paid</Table.Data>
            <Table.Data align="end">$250.00</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};

export const stripedAndHover = {
  code: `<Table striped hover>
  <Table.Head>
    <Table.Row>
      <Table.Header>Invoice</Table.Header>
      <Table.Header>Status</Table.Header>
      <Table.Header align="end">Amount</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>{/* rows */}</Table.Body>
</Table>`,
  label: 'Striped and hover',
  sample: (
    <Table striped hover>
      <Table.Head>
        <Table.Row>
          <Table.Header>Invoice</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header align="end">Amount</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {invoices.map((row) => (
          <Table.Row key={row.id}>
            <Table.Data>{row.id}</Table.Data>
            <Table.Data>{row.status}</Table.Data>
            <Table.Data align="end">${row.amount.toFixed(2)}</Table.Data>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const rowStates = {
  code: `<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Invoice</Table.Header>
      <Table.Header>Status</Table.Header>
      <Table.Header align="end">Amount</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row selected>
      <Table.Data>INV-001</Table.Data>
      <Table.Data>Active</Table.Data>
      <Table.Data align="end">$250.00</Table.Data>
    </Table.Row>
    <Table.Row interactive>
      <Table.Data>INV-002</Table.Data>
      <Table.Data>Clickable</Table.Data>
      <Table.Data align="end">$512.50</Table.Data>
    </Table.Row>
    <Table.Row disabled>
      <Table.Data>INV-003</Table.Data>
      <Table.Data>Disabled</Table.Data>
      <Table.Data align="end">$128.99</Table.Data>
    </Table.Row>
  </Table.Body>
</Table>`,
  label: 'Row states',
  sample: (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Invoice</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header align="end">Amount</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row selected>
          <Table.Data>INV-001</Table.Data>
          <Table.Data>Active</Table.Data>
          <Table.Data align="end">$250.00</Table.Data>
        </Table.Row>
        <Table.Row interactive>
          <Table.Data>INV-002</Table.Data>
          <Table.Data>Clickable</Table.Data>
          <Table.Data align="end">$512.50</Table.Data>
        </Table.Row>
        <Table.Row disabled>
          <Table.Data>INV-003</Table.Data>
          <Table.Data>Disabled</Table.Data>
          <Table.Data align="end">$128.99</Table.Data>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const stickyFirstColumn = {
  code: `<Table.Container label="Sticky first column table" scroll="horizontal">
  <Table style={{ minWidth: 760 }}>
    <Table.Head>
      <Table.Row>
        <Table.Header sticky width={180}>Invoice</Table.Header>
        <Table.Header width={220}>Owner</Table.Header>
        <Table.Header width={220}>Team</Table.Header>
        <Table.Header width={180}>Status</Table.Header>
        <Table.Header align="end" width={160}>Amount</Table.Header>
      </Table.Row>
    </Table.Head>

    <Table.Body>
      {rows.map((row) => (
        <Table.Row key={row.id}>
          <Table.Data sticky width={180}>{row.id}</Table.Data>
          <Table.Data width={220}>{row.owner}</Table.Data>
          <Table.Data width={220}>{row.team}</Table.Data>
          <Table.Data width={180}>{row.status}</Table.Data>
          <Table.Data align="end" width={160}>
            {'$' + row.amount.toFixed(2)}
          </Table.Data>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</Table.Container>`,
  label: 'Sticky first column',
  sample: (
    <Table.Container label="Sticky first column table" scroll="horizontal">
      <Table style={{ minWidth: 760 }}>
        <Table.Head>
          <Table.Row>
            <Table.Header sticky width={180}>
              Invoice
            </Table.Header>
            <Table.Header width={220}>Owner</Table.Header>
            <Table.Header width={220}>Team</Table.Header>
            <Table.Header width={180}>Status</Table.Header>
            <Table.Header align="end" width={160}>
              Amount
            </Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {invoices.map((row, index) => (
            <Table.Row key={row.id}>
              <Table.Data sticky width={180}>
                {row.id}
              </Table.Data>
              <Table.Data width={220}>{row.owner}</Table.Data>
              <Table.Data width={220}>
                {payouts[index]?.team ?? 'Ops'}
              </Table.Data>
              <Table.Data width={180}>{row.status}</Table.Data>
              <Table.Data align="end" width={160}>
                ${row.amount.toFixed(2)}
              </Table.Data>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
  ),
};

export const totalsFooter = {
  code: `const total = rows.reduce((sum, row) => sum + row.amount, 0);

<Table caption="Monthly payouts">
  <Table.Head>
    <Table.Row>
      <Table.Header scope="col">Owner</Table.Header>
      <Table.Header scope="col">Team</Table.Header>
      <Table.Header align="end" scope="col">Amount</Table.Header>
    </Table.Row>
  </Table.Head>

  <Table.Body>{/* rows */}</Table.Body>

  <Table.Foot>
    <Table.Row>
      <Table.Header scope="row" colSpan={2} align="end">Total</Table.Header>
      <Table.Data align="end">{'$' + total.toFixed(2)}</Table.Data>
    </Table.Row>
  </Table.Foot>
</Table>`,
  label: 'Totals footer',
  sample: (
    <Table caption="Monthly payouts">
      <Table.Head>
        <Table.Row>
          <Table.Header scope="col">Owner</Table.Header>
          <Table.Header scope="col">Team</Table.Header>
          <Table.Header align="end" scope="col">
            Amount
          </Table.Header>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        {payouts.map((row) => (
          <Table.Row key={`${row.owner}-${row.submittedAt}`}>
            <Table.Data>{row.owner}</Table.Data>
            <Table.Data>{row.team}</Table.Data>
            <Table.Data align="end">${row.amount.toFixed(2)}</Table.Data>
          </Table.Row>
        ))}
      </Table.Body>

      <Table.Foot>
        <Table.Row>
          <Table.Header align="end" colSpan={2} scope="row">
            Total
          </Table.Header>
          <Table.Data align="end">
            ${payouts.reduce((sum, row) => sum + row.amount, 0).toFixed(2)}
          </Table.Data>
        </Table.Row>
      </Table.Foot>
    </Table>
  ),
};

export const emptyStateWithAction = {
  code: `<Table
  caption="Archived invoices"
  columns={[
    { key: 'invoice', header: 'Invoice' },
    { key: 'status', header: 'Status' },
    { key: 'amount', header: 'Amount', align: 'end' },
  ]}
  data={[]}
  emptyState={
    <Table.Empty
      title="No archived invoices"
      description="When invoices are archived, they will appear in this table."
      action={<Button size="small" type="button">Create invoice</Button>}
    />
  }
/>`,
  label: 'Empty state with action',
  sample: (
    <Table
      caption="Archived invoices"
      columns={[
        { key: 'invoice', header: 'Invoice' },
        { key: 'status', header: 'Status' },
        { key: 'amount', header: 'Amount', align: 'end' },
      ]}
      data={[]}
      emptyState={
        <Table.Empty
          action={
            <Button size="small" type="button">
              Create invoice
            </Button>
          }
          description="When invoices are archived, they will appear in this table."
          title="No archived invoices"
        />
      }
    />
  ),
};

const directionCode = `<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header sticky width={180}>Invoice</Table.Header>
      <Table.Header width={260}>Owner</Table.Header>
      <Table.Header align="end" width={180}>Amount</Table.Header>
    </Table.Row>
  </Table.Head>

  <Table.Body>
    <Table.Row>
      <Table.Data sticky width={180}>INV-001</Table.Data>
      <Table.Data width={260}>Avery</Table.Data>
      <Table.Data align="end" width={180}>$250.00</Table.Data>
    </Table.Row>
  </Table.Body>
</Table>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: (
    <Table.Container label="LTR sticky table" scroll="horizontal">
      <div dir="ltr">
        <Table style={{ minWidth: 620 }}>
          <Table.Head>
            <Table.Row>
              <Table.Header sticky width={180}>
                Invoice
              </Table.Header>
              <Table.Header width={260}>Owner</Table.Header>
              <Table.Header align="end" width={180}>
                Amount
              </Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {invoices.map((row) => (
              <Table.Row key={row.id}>
                <Table.Data sticky width={180}>
                  {row.id}
                </Table.Data>
                <Table.Data width={260}>{row.owner}</Table.Data>
                <Table.Data align="end" width={180}>
                  ${row.amount.toFixed(2)}
                </Table.Data>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Table.Container>
  ),
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <Table.Container label="RTL sticky table" scroll="horizontal">
      <div dir="rtl">
        <Table style={{ minWidth: 620 }}>
          <Table.Head>
            <Table.Row>
              <Table.Header sticky width={180}>
                Invoice
              </Table.Header>
              <Table.Header width={260}>Owner</Table.Header>
              <Table.Header align="end" width={180}>
                Amount
              </Table.Header>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {invoices.map((row) => (
              <Table.Row key={row.id}>
                <Table.Data sticky width={180}>
                  {row.id}
                </Table.Data>
                <Table.Data width={260}>{row.owner}</Table.Data>
                <Table.Data align="end" width={180}>
                  ${row.amount.toFixed(2)}
                </Table.Data>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Table.Container>
  ),
};

export const directionExamples = [directionLTR, directionRTL];

export const propHighlights = [
  basicUsage,
  sizes,
  density,
  responsiveScrollMobile,
  stickyFirstColumn,
  responsiveColumnVisibility,
];
