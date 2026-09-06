import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { PaddingExample } from '../examples/padding.tsx';
import { AlignmentExample } from '../examples/alignment.tsx';
import { HostCompositionExample } from '../examples/host-composition.tsx';
import { ClassNameRenderPropExample } from '../examples/class-name-render-prop.tsx';
import { StyleRenderPropExample } from '../examples/style-render-prop.tsx';

describe('@godaddy/antares', function antares() {
  describe('#Box', function boxTests() {
    it('renders boxes with padding in the browser', async function rendersPadding() {
      const { getByText } = await render(<PaddingExample />);
      expect(getByText('Padding: md')).toBeInTheDocument();
      expect(getByText('Block Padding: lg')).toBeInTheDocument();
      expect(getByText('Inline Padding: xl')).toBeInTheDocument();
    });

    it('renders boxes with alignment in the browser', async function rendersAlignment() {
      const { getByText } = await render(<AlignmentExample />);
      expect(getByText('align-self: start')).toBeInTheDocument();
      expect(getByText('align-self: center')).toBeInTheDocument();
      expect(getByText('align-self: end')).toBeInTheDocument();
    });

    it('composes className and style for a host element', async function composesHost() {
      const { getByText } = await render(<HostCompositionExample />);

      const span = getByText('Save');
      expect(span).toHaveClass('custom');
      expect(span.element().getAttribute('style')).toContain('padding');
      expect(span).toHaveStyle({ opacity: '0.5' });
    });

    it('composes a function className and re-evaluates on interaction', async function composesFunctionClassName() {
      const { getByRole } = await render(<ClassNameRenderPropExample />);

      const button = getByRole('button');
      expect(button).toHaveClass('idle');

      await userEvent.hover(button);
      expect(button).toHaveClass('hover');

      await resetHover();
    });

    it('merges a function style and re-evaluates when progress changes', async function mergesFunctionStyle() {
      const { getByRole, rerender } = await render(<StyleRenderPropExample />);

      const progressbar = getByRole('progressbar');
      expect(progressbar.element().getAttribute('style')).toContain('padding');
      expect(progressbar).toHaveStyle({ opacity: '0.5' });

      await rerender(<StyleRenderPropExample isIndeterminate={false} />);
      expect(progressbar.element().getAttribute('style')).toContain('padding');
      expect(progressbar).toHaveStyle({ opacity: '1' });
    });
  });
});
