import { describe, it, beforeAll, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import assume from 'assume';
import { Button, LinkButton } from '@godaddy/antares';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { DismissibleExample } from '../examples/dismissible.tsx';
import { EmphasesExample } from '../examples/emphases.tsx';

const emphasisIconMap: ReadonlyArray<readonly [string, string]> = [
  ['critical', 'alert'],
  ['warning', 'alert'],
  ['success', 'checkmark'],
  ['info', 'information'],
  ['highlight', 'star'],
  ['premium', 'diamond'],
  ['internal', 'comment']
];

describe('@godaddy/antares', function antares() {
  describe('#Alert', function alertTests() {
    beforeAll(preloadTestIcons);

    it('renders with role="alert"', async function rendersRole() {
      const { getByRole } = await render(<DefaultExample />);

      assume(getByRole('alert').query()).is.not.equal(null);
    });

    it('renders children only (no title)', async function childrenOnly() {
      const { container } = await render(<DefaultExample title={undefined} />);
      const alert = container.querySelector('[role="alert"]') as HTMLElement;

      assume(alert).is.not.equal(null);
      assume(alert.querySelector('[class*="title"]')).equals(null);
      assume(alert.textContent).contains('You can now start building your website.');
    });

    it('renders title and children', async function titleAndChildren() {
      const { container } = await render(<DefaultExample />);
      const alert = container.querySelector('[role="alert"]') as HTMLElement;
      const title = alert.querySelector('[class*="title"]');

      assume(title).is.not.equal(null);
      assume((title as HTMLElement).textContent).contains('Your domain is ready');
      assume(alert.textContent).contains('You can now start building your website.');
    });

    it('renders title, children and actions', async function titleChildrenActions() {
      const { getByRole, container } = await render(
        <DefaultExample
          actions={
            <Button variant="secondary" size="sm">
              Update
            </Button>
          }
        />
      );
      const alert = container.querySelector('[role="alert"]') as HTMLElement;

      assume(alert.querySelector('[class*="title"]')).is.not.equal(null);
      assume(alert.textContent).contains('You can now start building your website.');
      assume(getByRole('button', { name: 'Update' }).query()).is.not.equal(null);
    });

    it('renders children and actions (no title)', async function childrenActions() {
      const { getByRole, container } = await render(
        <DefaultExample
          title={undefined}
          actions={
            <Button variant="secondary" size="sm">
              Update
            </Button>
          }
        />
      );
      const alert = container.querySelector('[role="alert"]') as HTMLElement;

      assume(alert.querySelector('[class*="title"]')).equals(null);
      assume(alert.textContent).contains('You can now start building your website.');
      assume(getByRole('button', { name: 'Update' }).query()).is.not.equal(null);
    });

    it('renders all 7 emphasis variants with their correct icon', async function emphasisIcons() {
      const { container } = await render(<EmphasesExample />);
      const alerts = container.querySelectorAll('[role="alert"]');
      assume(alerts.length).equals(7);

      for (const [emphasis, icon] of emphasisIconMap) {
        const alert = container.querySelector(`[data-emphasis="${emphasis}"]`);
        assume(alert).is.not.equal(null);
        const iconEl = (alert as HTMLElement).querySelector(`[data-icon="${icon}"]`);
        assume(iconEl).is.not.equal(null);
      }
    });

    it('icon has a width and height of 1.625rem', async function iconSize() {
      const { container } = await render(<EmphasesExample />);
      const alerts = Array.from(container.querySelectorAll('[role="alert"]')) as HTMLElement[];
      assume(alerts.length).equals(7);

      for (const alert of alerts) {
        const value = getComputedStyle(alert).getPropertyValue('--alert-icon-size').trim();
        assume(value).equals('1.625rem');
      }
    });

    it('applies font-size and font-weight tokens to the title element', async function titleStyles() {
      const { container } = await render(<DefaultExample />);
      const title = container.querySelector('[class*="title"]') as HTMLElement;
      assume(title).is.not.equal(null);

      const styles = getComputedStyle(title);

      // font-weight token --ux-1a9e4a3 resolves to 700; fallback is 700.
      assume(styles.fontWeight).equals('700');

      // font-size token --ux-18ime9a must resolve to a non-empty, non-default value.
      assume(styles.fontSize).is.a('string');
      assume(styles.fontSize.length).is.above(0);
      assume(styles.fontSize).does.not.equal('');
    });

    it('icon, inline-start border and surrounding borders share the same accent color for each emphasis', async function bordersAndIconShareAccent() {
      const { container } = await render(<EmphasesExample />);

      for (const [emphasis] of emphasisIconMap) {
        const alert = container.querySelector(`[data-emphasis="${emphasis}"]`) as HTMLElement;
        assume(alert).is.not.equal(null);

        const styles = getComputedStyle(alert);
        const accent = styles.borderInlineStartColor;

        // Icon color must match the accent
        const svg = alert.querySelector('svg[data-icon]') as SVGElement;
        assume(svg).is.not.equal(null);
        assume(getComputedStyle(svg as Element).color).equals(accent);

        // All four physical borders must also share the accent color
        assume(styles.borderTopColor).equals(accent);
        assume(styles.borderRightColor).equals(accent);
        assume(styles.borderBottomColor).equals(accent);
        assume(styles.borderLeftColor).equals(accent);
      }
    });

    it('renders the dismiss button when onClose is provided', async function dismissPresent() {
      const { getByRole, container } = await render(<DefaultExample onClose={vi.fn()} />);

      assume(getByRole('button', { name: 'Close' }).query()).is.not.equal(null);

      const alert = container.querySelector('[role="alert"]') as HTMLElement;

      assume(alert.hasAttribute('data-dismissible')).is.true();
    });

    it('does NOT render the dismiss button when onClose is omitted', async function dismissAbsent() {
      const { getByRole, container } = await render(<DefaultExample />);

      assume(getByRole('alert').query()).is.not.equal(null);

      const alert = container.querySelector('[role="alert"]') as HTMLElement;

      assume(alert.hasAttribute('data-dismissible')).is.false();
      assume(getByRole('button', { name: 'Close' }).query()).equals(null);
    });

    it('clicking the close button hides the alert (DismissibleExample state cycle)', async function dismissCycle() {
      const { getByRole } = await render(<DismissibleExample />);

      assume(getByRole('alert').query()).is.not.equal(null);

      await userEvent.click(getByRole('button', { name: 'Close' }));

      assume(getByRole('alert').query()).equals(null);
      assume(getByRole('button', { name: 'Show alert' }).query()).is.not.equal(null);

      await userEvent.click(getByRole('button', { name: 'Show alert' }));

      await vi.waitFor(function reappears() {
        assume(getByRole('alert').query()).is.not.equal(null);
      });
    });

    it('uses the custom aria-label provided through ariaLabels.close', async function customAriaLabel() {
      const { getByRole } = await render(<DismissibleExample ariaLabels={{ close: 'Cerrar alerta' }} />);

      assume(getByRole('button', { name: 'Cerrar alerta' }).query()).is.not.equal(null);
      assume(getByRole('button', { name: 'Close' }).query()).equals(null);

      await userEvent.click(getByRole('button', { name: 'Cerrar alerta' }));

      assume(getByRole('alert').query()).equals(null);
    });

    it('renders a link button (LinkButton) inside the actions slot', async function linkAction() {
      const { getByRole } = await render(
        <DefaultExample
          actions={
            <LinkButton variant="secondary" size="sm" href="https://example.com">
              Learn more
            </LinkButton>
          }
        />
      );

      const link = getByRole('link', { name: 'Learn more' }).query();

      assume(link).is.not.equal(null);
      assume((link as HTMLAnchorElement).getAttribute('href')).equals('https://example.com');
    });
  });
});
