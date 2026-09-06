import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { ColumnsExample } from '../examples/columns.tsx';
import { AreasExample } from '../examples/areas.tsx';
import { HostCompositionExample } from '../examples/host-composition.tsx';
import { ClassNameRenderPropExample } from '../examples/class-name-render-prop.tsx';
import { StyleRenderPropExample } from '../examples/style-render-prop.tsx';

describe('@godaddy/antares', function antares() {
  describe('#Grid', function gridTests() {
    it('renders the default grid in the browser', async function rendersDefault() {
      const { getByText } = await render(<DefaultExample />);
      expect(getByText('Item 1')).toBeInTheDocument();
      expect(getByText('Item 2')).toBeInTheDocument();
      expect(getByText('Item 3')).toBeInTheDocument();
    });

    it('renders grid with column variations in the browser', async function rendersColumns() {
      const { getByText } = await render(<ColumnsExample />);
      expect(getByText('columns: repeat(2, 1fr)')).toBeInTheDocument();
      expect(getByText('columns: 1fr 2fr 1fr')).toBeInTheDocument();
      expect(getByText('columns: auto 1fr auto')).toBeInTheDocument();
    });

    it('renders grid with named areas in the browser', async function rendersAreas() {
      const { getByText } = await render(<AreasExample />);
      expect(getByText('Header')).toBeInTheDocument();
      expect(getByText('Sidebar')).toBeInTheDocument();
      expect(getByText('Main Content')).toBeInTheDocument();
      expect(getByText('Footer')).toBeInTheDocument();
    });

    it('composes className and style for a host element', async function composesHost() {
      const { getByText } = await render(<HostCompositionExample />);

      const span = getByText('Cell');
      expect(span).toHaveClass('custom');
      expect(span.element().getAttribute('style')).toContain('grid-template-columns');
      expect(span).toHaveStyle({ opacity: '0.5' });
    });

    it('preserves grid base class on interaction', async function preservesGridClass() {
      const { getByRole } = await render(<ClassNameRenderPropExample />);

      const button = getByRole('button');
      expect(button).toHaveClass('idle');

      await userEvent.hover(button);
      expect(button).toHaveClass('hover');

      await resetHover();
    });

    it('preserves grid style when progress changes', async function preservesGridStyle() {
      const { getByRole, rerender } = await render(<StyleRenderPropExample />);

      const progressbar = getByRole('progressbar');
      expect(progressbar.element().getAttribute('style')).toContain('grid-template-columns');
      expect(progressbar).toHaveStyle({ opacity: '0.5' });

      await rerender(<StyleRenderPropExample isIndeterminate={false} />);
      expect(progressbar.element().getAttribute('style')).toContain('grid-template-columns');
      expect(progressbar).toHaveStyle({ opacity: '1' });
    });
  });
});
