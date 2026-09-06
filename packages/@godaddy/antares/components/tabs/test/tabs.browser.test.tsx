import assume from 'assume';
import { createRef } from 'react';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { describe, expect, it } from 'vitest';
import { ControlledExample } from '../examples/controlled.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { DisabledExample } from '../examples/disabled.tsx';
import { ManillaExample } from '../examples/manilla.tsx';
import { OverflowExample } from '../examples/overflow.tsx';
import { RTLExample } from '../examples/rtl.tsx';
import { PlaygroundExample } from '../examples/tabs-playground.tsx';
import { RefsExample } from '../examples/refs.tsx';
import { TypesExample } from '../examples/types.tsx';

function isHTMLDivElement(element: unknown): element is HTMLDivElement {
  return element instanceof HTMLDivElement;
}

function getViewport(tablistName: string): HTMLDivElement {
  const tablist = page.getByRole('tablist', { name: tablistName }).element();
  const viewport = tablist.parentElement;
  if (!(viewport instanceof HTMLDivElement)) throw new Error('Tabs viewport not found');
  return viewport;
}

function getRoot(tablistName: string): HTMLElement {
  const tablist = page.getByRole('tablist', { name: tablistName }).element();
  const root = tablist.closest('[data-design]');
  if (!(root instanceof HTMLElement)) throw new Error('Tabs root not found');
  return root;
}

describe('@godaddy/antares', function antares() {
  describe('#Tabs', function tabsTests() {
    describe('semantics', function semanticsTests() {
      it('exposes tablist, tab, and panel roles with linked ARIA relationships', async function ariaRelationships() {
        await render(<DefaultExample />);

        const tablist = page.getByRole('tablist', { name: 'Account settings' });
        await expect.element(tablist).toBeVisible();
        const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
        const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');

        expect(tabs).toHaveLength(3);
        expect(panels).toHaveLength(1);
        const selectedTab = document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
        const selectedPanel = panels[0];
        expect(selectedTab?.getAttribute('aria-controls')).toBe(selectedPanel?.id);
        expect(selectedPanel?.getAttribute('aria-labelledby')).toBe(selectedTab?.id);
      });
    });

    describe('refs and types', function refsAndTypesTests() {
      it('forwards object refs to each Tabs component surface', async function forwardsObjectRefs() {
        const tabsRef = createRef<HTMLDivElement>();
        const tabListRef = createRef<HTMLDivElement>();
        const tabRef = createRef<HTMLDivElement>();
        const tabPanelsRef = createRef<HTMLDivElement>();
        const tabPanelRef = createRef<HTMLDivElement>();

        await render(
          <RefsExample
            tabsRef={tabsRef}
            tabListRef={tabListRef}
            tabRef={tabRef}
            tabPanelsRef={tabPanelsRef}
            tabPanelRef={tabPanelRef}
          />
        );

        assume(tabsRef.current instanceof HTMLDivElement).equals(true);
        assume(tabsRef.current?.getAttribute('data-design')).equals('underline');
        assume(tabListRef.current?.getAttribute('role')).equals('tablist');
        assume(tabRef.current?.getAttribute('role')).equals('tab');
        assume(tabPanelsRef.current instanceof HTMLDivElement).equals(true);
        assume(tabPanelRef.current?.getAttribute('role')).equals('tabpanel');
      });

      it('routes TabList customization to its matching surfaces', async function routesTabListCustomization() {
        const tabListRef = createRef<HTMLDivElement>();

        await render(
          <RefsExample
            tabListRef={tabListRef}
            tabListClassName="tablist-custom"
            tabListStyle={{ color: 'red' }}
            tabListContainerProps={{
              className: 'shell-custom',
              style: { width: '100%', alignItems: 'flex-start' }
            }}
          />
        );

        const tabList = page.getByRole('tablist', { name: 'Account settings' }).element();
        const shell = tabList.parentElement?.parentElement;
        if (!(shell instanceof HTMLDivElement)) throw new Error('Tabs shell not found');

        expect(tabList).toBe(tabListRef.current);
        expect(tabList).toHaveClass('tablist-custom');
        expect(tabList).toHaveStyle({ color: 'red' });
        expect(shell).toHaveClass('shell-custom');
        expect(shell.className).toContain('listShell');
        expect(shell).toHaveStyle({ width: '100%', alignItems: 'flex-start' });
      });

      it('forwards callback refs without losing TabList overflow measurement', async function forwardsCallbackRef() {
        const tabListElement: { current: HTMLDivElement | null } = { current: null };
        await render(
          <OverflowExample
            tabListRef={function tabListRef(element) {
              tabListElement.current = element;
            }}
          />
        );

        await expect.element(page.getByRole('button', { name: 'Next tabs' })).toBeVisible();
        const assignedTabListElement = tabListElement.current;
        if (!isHTMLDivElement(assignedTabListElement)) throw new Error('TabList ref was not assigned');
        assume(assignedTabListElement.getAttribute('role')).equals('tablist');
      });

      it('renders generic collection examples with linked panels', async function genericCollectionTypes() {
        await render(<TypesExample />);

        await expect.element(page.getByRole('tablist', { name: 'Account settings' })).toBeVisible();
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Account settings');
      });
    });

    describe('selection', function selectionTests() {
      it('selects the first tab initially and exposes only its panel', async function initialSelection() {
        await render(<DefaultExample />);

        await expect.element(page.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Account settings');
        await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'false');
      });

      it('selects a tab and shows its panel', async function selectsTab() {
        const user = userEvent.setup();
        await render(<DefaultExample />);

        await expect.element(page.getByRole('tablist', { name: 'Account settings' })).toBeVisible();

        await user.click(page.getByRole('tab', { name: 'Billing' }));

        await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Billing settings');
      });

      it('selects a Manilla tab and shows its panel', async function manillaSelection() {
        const user = userEvent.setup();
        await render(<ManillaExample />);

        await expect.element(page.getByRole('tablist', { name: 'Documents' })).toBeVisible();
        await expect.element(page.getByRole('tab', { name: 'Recent' })).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Recent documents');

        await user.click(page.getByRole('tab', { name: 'Shared' }));

        await expect.element(page.getByRole('tab', { name: 'Shared' })).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByRole('tab', { name: 'Recent' })).toHaveAttribute('aria-selected', 'false');
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Shared documents');
      });

      it('starts with and updates controlled selection', async function controlledSelection() {
        const user = userEvent.setup();
        await render(<ControlledExample />);

        await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByText('Current selection: billing')).toBeVisible();
        await user.click(page.getByRole('tab', { name: 'Security' }));
        await expect.element(page.getByText('Current selection: security')).toBeVisible();
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Security settings');
      });
    });

    describe('keyboard navigation', function keyboardNavigationTests() {
      it('activates tabs automatically with ArrowRight', async function automaticActivation() {
        const user = userEvent.setup();
        await render(<DefaultExample />);
        await user.click(page.getByRole('tab', { name: 'Account' }));

        await user.keyboard('{ArrowRight}');

        await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Billing settings');
      });

      it('requires activation after focus in manual mode', async function manualActivation() {
        const user = userEvent.setup();
        await render(<PlaygroundExample keyboardActivation="manual" />);
        const account = page.getByRole('tab', { name: 'Account' });
        const billing = page.getByRole('tab', { name: 'Billing' });

        await user.click(account);
        await user.keyboard('{ArrowRight}');

        await expect.element(billing).toHaveFocus();
        await expect.element(account).toHaveAttribute('aria-selected', 'true');
        await expect.element(billing).toHaveAttribute('aria-selected', 'false');

        await user.keyboard('{Enter}');

        await expect.element(billing).toHaveAttribute('aria-selected', 'true');
        await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Billing');
      });

      it('supports Arrow, Home, and End navigation', async function keyboardNavigation() {
        const user = userEvent.setup();
        await render(<DefaultExample />);
        await user.click(page.getByRole('tab', { name: 'Billing' }));

        await user.keyboard('{Home}');
        await expect.element(page.getByRole('tab', { name: 'Account' })).toHaveFocus();
        await user.keyboard('{End}');
        await expect.element(page.getByRole('tab', { name: 'Security' })).toHaveFocus();
        await expect.element(page.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('disabled', function disabledTests() {
      it('skips disabled tabs and exposes disabled semantics', async function disabledNavigation() {
        const user = userEvent.setup();
        await render(<DisabledExample />);
        const disabled = page.getByRole('tab', { name: 'Billing' });

        await expect.element(disabled).toHaveAttribute('aria-disabled', 'true');
        await user.click(page.getByRole('tab', { name: 'Account' }));
        await user.keyboard('{ArrowRight}');
        await expect.element(page.getByRole('tab', { name: 'Security' })).toHaveFocus();
        await expect.element(page.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('overflow', function overflowTests() {
      describe('navigation', function navigationTests() {
        it('enables Previous tabs after moving forward in LTR', async function ltrNextBoundary() {
          const user = userEvent.setup();
          await render(<OverflowExample />);
          const previous = page.getByRole('button', { name: 'Previous tabs' });
          const next = page.getByRole('button', { name: 'Next tabs' });

          await expect.element(previous).toBeDisabled();
          await expect.element(next).not.toBeDisabled();
          await user.click(next);

          await expect.element(previous).not.toBeDisabled();
        });

        it('enables Next tabs after moving backward from the LTR end', async function ltrPreviousBoundary() {
          const user = userEvent.setup();
          await render(<OverflowExample />);
          const viewport = getViewport('Product settings');
          const previous = page.getByRole('button', { name: 'Previous tabs' });
          const next = page.getByRole('button', { name: 'Next tabs' });
          viewport.scrollLeft = viewport.scrollWidth;
          viewport.dispatchEvent(new Event('scroll'));
          await expect.element(next).toBeDisabled();
          await expect.element(previous).not.toBeDisabled();

          await user.click(previous);

          await expect.element(next).not.toBeDisabled();
        });
      });

      describe('resize', function resizeTests() {
        it('updates controls when the available width shrinks and grows', async function resizeOverflow() {
          await render(<OverflowExample maxWidth="1000px" />);
          await expect.element(page.getByRole('button', { name: 'Next tabs' })).not.toBeInTheDocument();
          const root = getRoot('Product settings');
          root.style.width = '320px';
          root.style.maxWidth = '320px';
          await expect.element(page.getByRole('button', { name: 'Next tabs' })).toBeVisible();
          await expect.element(page.getByRole('button', { name: 'Previous tabs' })).toBeDisabled();

          root.style.width = '1000px';
          root.style.maxWidth = '1000px';
          await expect.element(page.getByRole('button', { name: 'Next tabs' })).not.toBeInTheDocument();
        });
      });

      describe('RTL navigation', function rtlNavigationTests() {
        it('updates overflow control states while moving forward and backward in RTL', async function rtlLogicalBoundaries() {
          const user = userEvent.setup();
          await render(<RTLExample />);
          const viewport = getViewport('Product settings');
          const previous = page.getByRole('button', { name: 'Previous tabs' });
          const next = page.getByRole('button', { name: 'Next tabs' });
          await expect.element(previous).toBeDisabled();
          await expect.element(next).not.toBeDisabled();

          await user.click(next);

          await expect.element(previous).not.toBeDisabled();
          viewport.scrollLeft = -(viewport.scrollWidth - viewport.clientWidth);
          viewport.dispatchEvent(new Event('scroll'));
          await expect.element(next).toBeDisabled();
          await expect.element(previous).not.toBeDisabled();

          await user.click(previous);

          await expect.element(next).not.toBeDisabled();
        });
      });

      describe('keyboard navigation', function keyboardNavigationTests() {
        it('selects overflowed tabs with ArrowRight and End', async function keyboardNavigation() {
          const user = userEvent.setup();
          await render(<OverflowExample />);
          const overview = page.getByRole('tab', { name: 'Overview' });
          const availability = page.getByRole('tab', { name: 'Availability' });
          const notifications = page.getByRole('tab', { name: 'Notifications' });

          await user.click(overview);
          await user.keyboard('{ArrowRight}');
          await expect.element(availability).toHaveFocus();
          await expect.element(availability).toHaveAttribute('aria-selected', 'true');
          await user.keyboard('{End}');
          await expect.element(notifications).toHaveFocus();
          await expect.element(notifications).toHaveAttribute('aria-selected', 'true');
        });
      });

      describe('ref integration', function refIntegrationTests() {
        it('keeps overflow detection when TabList receives a ref', async function refForwarding() {
          const tabListRef = createRef<HTMLDivElement>();
          await render(<OverflowExample tabListRef={tabListRef} />);

          await expect.element(page.getByRole('button', { name: 'Next tabs' })).toBeVisible();
          expect(tabListRef.current).toBeInstanceOf(HTMLDivElement);
        });
      });

      describe('controls', function controlTests() {
        it('does not render overflow controls when all tabs fit', async function noOverflowControls() {
          await render(<DefaultExample />);
          await expect.element(page.getByRole('button', { name: 'Previous tabs' })).not.toBeInTheDocument();
          await expect.element(page.getByRole('button', { name: 'Next tabs' })).not.toBeInTheDocument();
        });

        it('supports localized overflow labels', async function localizedLabels() {
          await render(
            <OverflowExample overflowLabels={{ previous: 'Pestañas anteriores', next: 'Pestañas siguientes' }} />
          );

          await expect.element(page.getByRole('button', { name: 'Pestañas siguientes' })).toBeVisible();
          await expect.element(page.getByRole('button', { name: 'Pestañas anteriores' })).toBeVisible();
        });
      });
    });
  });
});
