import { describe, it, beforeAll } from 'vitest';
import { createRef } from 'react';
import { render } from 'vitest-browser-react';
import assume from 'assume';
import { Icon, Tag } from '@godaddy/antares';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { EmphasesExample } from '../examples/emphases.tsx';
import { SizesExample } from '../examples/sizes.tsx';
import { HighContrastExample } from '../examples/high-contrast.tsx';
import { IconsExample } from '../examples/icons.tsx';
import { IndicatorExample } from '../examples/indicator.tsx';
import { InlineExample } from '../examples/inline.tsx';

describe('@godaddy/antares', function antares() {
  describe('#Tag', function tagTests() {
    beforeAll(preloadTestIcons);

    it('renders the text label', async function rendersLabel() {
      const { container } = await render(<DefaultExample />);
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag).is.not.equal(null);
      assume(tag.textContent).contains('Tag');
    });

    it('reflects emphasis, size, and design via data attributes', async function dataAttributes() {
      const { container } = await render(<DefaultExample emphasis="critical" size="lg" design="filled" />);
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag.getAttribute('data-emphasis')).equals('critical');
      assume(tag.getAttribute('data-size')).equals('lg');
      assume(tag.getAttribute('data-design')).equals('filled');
    });

    it('applies the default props when none are provided', async function defaults() {
      const { container } = await render(<DefaultExample />);
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag.getAttribute('data-emphasis')).equals('passive');
      assume(tag.getAttribute('data-size')).equals('md');
      assume(tag.getAttribute('data-design')).equals('filled');
      assume(tag.hasAttribute('data-high-contrast')).equals(false);
      assume(tag.hasAttribute('data-indicator')).equals(false);
    });

    it('renders a leading icon passed as a child', async function leadingIcon() {
      const { container } = await render(<IconsExample />);
      const icon = container.querySelector('[data-icon]') as HTMLElement;

      assume(icon).is.not.equal(null);
      assume(icon.getAttribute('aria-hidden')).equals('true');
    });

    it('renders an indicator and forces high contrast', async function indicator() {
      const { container } = await render(<IndicatorExample />);
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag.hasAttribute('data-indicator')).equals(true);
      assume(tag.hasAttribute('data-high-contrast')).equals(true);
    });

    it('enables high contrast explicitly', async function highContrast() {
      const { container } = await render(<HighContrastExample />);
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag.hasAttribute('data-high-contrast')).equals(true);
    });

    it('forces high contrast for the inline design', async function inlineHighContrast() {
      const { container } = await render(<InlineExample />);
      const tag = container.querySelector('span[data-design="inline"]') as HTMLElement;

      assume(tag).is.not.equal(null);
      assume(tag.hasAttribute('data-high-contrast')).equals(true);
    });

    it('renders no icon when none is provided as a child', async function noIcon() {
      const { container } = await render(<DefaultExample />);

      assume(container.querySelector('[data-icon]')).equals(null);
    });

    it('renders children alongside the indicator', async function indicatorWithChild() {
      const { container } = await render(
        <Tag indicator>
          <Icon icon="information" aria-hidden="true" />
          Both
        </Tag>
      );
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag.hasAttribute('data-indicator')).equals(true);
      assume(container.querySelector('[data-icon="information"]')).is.not.equal(null);
    });

    it('forwards ref to the underlying span', async function forwardsRef() {
      const ref = createRef<HTMLSpanElement>();
      await render(<Tag ref={ref}>Ref</Tag>);

      assume(ref.current).is.not.equal(null);
      assume(ref.current?.tagName).equals('SPAN');
    });

    it('merges className and forwards arbitrary props', async function passthrough() {
      const { container } = await render(<DefaultExample className="custom" data-testid="tag-x" />);
      const tag = container.querySelector('span[data-emphasis]') as HTMLElement;

      assume(tag.classList.contains('custom')).equals(true);
      assume(tag.getAttribute('data-testid')).equals('tag-x');
    });

    it('renders all 9 emphasis values via data attribute', async function allEmphases() {
      const { container } = await render(<EmphasesExample />);
      const tags = container.querySelectorAll('span[data-emphasis]');

      assume(tags.length).equals(9);
      for (const emphasis of [
        'passive',
        'critical',
        'warning',
        'success',
        'info',
        'highlight',
        'premium',
        'internal',
        'neutral'
      ]) {
        assume(container.querySelector(`span[data-emphasis="${emphasis}"]`)).is.not.equal(null);
      }
    });

    it('renders all 3 sizes via data attribute', async function allSizes() {
      const { container } = await render(<SizesExample />);
      const tags = container.querySelectorAll('span[data-emphasis]');

      assume(tags.length).equals(3);
      for (const size of ['sm', 'md', 'lg']) {
        assume(container.querySelector(`span[data-size="${size}"]`)).is.not.equal(null);
      }
    });

    it('sizes an SVG child to a non-zero height', async function svgChildSize() {
      const { container } = await render(<IconsExample />);
      const svg = container.querySelector('svg') as SVGElement;
      const { height } = getComputedStyle(svg);

      assume(height).is.not.equal('');
      assume(height).is.not.equal('0px');
    });

    it('renders inline design with a transparent background', async function inlineNoBackground() {
      const { container } = await render(<InlineExample />);
      const tag = container.querySelector('span[data-design="inline"]') as HTMLElement;
      const bg = getComputedStyle(tag).backgroundColor;

      assume(bg).equals('rgba(0, 0, 0, 0)');
    });
  });
});
