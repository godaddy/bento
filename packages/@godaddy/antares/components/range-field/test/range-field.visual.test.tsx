import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { ControlledExample } from '../examples/controlled.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { DisabledExample } from '../examples/disabled.tsx';
import { LabelsExample } from '../examples/labels.tsx';
import { MarkersExample } from '../examples/markers.tsx';
import { RangeExample } from '../examples/range.tsx';
import { ValueDisplayExample } from '../examples/value-display.tsx';

describe('@godaddy/antares', function antares() {
  beforeEach(resetHover);

  describe('#RangeField', function rangeFieldTests() {
    it('default example', async function defaultExample() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('controlled example', async function controlledExample() {
      const { container } = await render(<ControlledExample />);
      await expect(container).toMatchScreenshot('controlled');
    });

    it('disabled example', async function disabledExample() {
      const { container } = await render(<DisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('labels example', async function labelsExample() {
      const { container } = await render(<LabelsExample />);
      await expect(container).toMatchScreenshot('labels');
    });

    it('value display example', async function valueDisplayExample() {
      const { container } = await render(<ValueDisplayExample />);
      await expect(container).toMatchScreenshot('value-display');
    });

    it('markers example', async function markersExample() {
      const { container } = await render(<MarkersExample />);
      await expect(container).toMatchScreenshot('markers');
    });

    it('range example', async function rangeExample() {
      const { container } = await render(<RangeExample />);
      await expect(container).toMatchScreenshot('range');
    });
  });
});
