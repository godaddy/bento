import { BarChart } from '@godaddy/antares';

/**
 * `categoryColors` maps individual category values to palette color indices, overriding
 * the series color for just those bars — so a single series can carry a different color
 * per category. All three periods here share the same category-to-color map, so each
 * channel keeps one color across every period; the comparison periods are dropped to
 * reduced opacity.
 *
 * A category missing from the map falls back to the series' own default color. `Marketplace`
 * and `Gift Cards` are both absent from `categoryColors`, so each period draws them in that
 * period's default palette color instead of a shared channel color — showing the sparse-map
 * fallback alongside the mapped channels.
 * @title Category colors
 * @order 10
 */
export function CategoryColorsExample(props: any) {
  // Sales channel → palette color index. `Marketplace` and `Gift Cards` are intentionally
  // omitted so they fall back to each series' default color. Indices start at 2 to keep the
  // mapped channels distinct from those per-series defaults (0, 1, 2).
  const categoryColors = {
    'In Person': 3,
    'Online Store': 4,
    'Pay Links': 5,
    Invoicing: 6,
    'Virtual Terminal': 7
  };

  const current = [
    { channel: 'In Person', amount: 1043.5 },
    { channel: 'Online Store', amount: 692.12 },
    { channel: 'Pay Links', amount: 618.4 },
    { channel: 'Invoicing', amount: 431.8 },
    { channel: 'Virtual Terminal', amount: 182.25 },
    { channel: 'Marketplace', amount: 305.6 },
    { channel: 'Gift Cards', amount: 214.0 }
  ];

  const previous = [
    { channel: 'In Person', amount: 918.0 },
    { channel: 'Online Store', amount: 604.75 },
    { channel: 'Pay Links', amount: 560.0 },
    { channel: 'Invoicing', amount: 372.5 },
    { channel: 'Virtual Terminal', amount: 96.5 },
    { channel: 'Marketplace', amount: 210.4 },
    { channel: 'Gift Cards', amount: 168.0 }
  ];

  const twoYearsAgo = [
    { channel: 'In Person', amount: 802.0 },
    { channel: 'Online Store', amount: 540.0 },
    { channel: 'Pay Links', amount: 498.0 },
    { channel: 'Invoicing', amount: 300.0 },
    { channel: 'Virtual Terminal', amount: 60.0 },
    { channel: 'Marketplace', amount: 150.0 },
    { channel: 'Gift Cards', amount: 120.0 }
  ];

  const series = [
    {
      id: 'this-period',
      name: 'This period',
      categoryColors,
      data: current.map((d) => ({ x: d.amount, y: d.channel }))
    },
    {
      id: 'previous-period',
      name: 'Previous period',
      categoryColors,
      opacity: 0.6,
      data: previous.map((d) => ({ x: d.amount, y: d.channel }))
    },
    {
      id: 'two-years-ago',
      name: 'Two years ago',
      categoryColors,
      opacity: 0.3,
      data: twoYearsAgo.map((d) => ({ x: d.amount, y: d.channel }))
    }
  ];

  return (
    <BarChart
      series={series}
      orientation="horizontal"
      xAccessor={(d: { x: number; y: string }) => d.x}
      yAccessor={(d: { x: number; y: string }) => d.y}
      xTickFormat={(value) => `$${Number(value).toLocaleString()}`}
      xDomain={[0, 1100]}
      xGridlines={true}
      yBaseline={true}
      legendPosition={null}
      height={520}
      aria-label="Payment activity by sales channel"
      desc="Horizontal bar chart of net payments per sales channel for three periods; each mapped channel keeps its own color via categoryColors across all periods and the comparison periods are shown at reduced opacity, while the unmapped Marketplace and Gift Cards channels fall back to each period's default color"
      {...props}
    />
  );
}
