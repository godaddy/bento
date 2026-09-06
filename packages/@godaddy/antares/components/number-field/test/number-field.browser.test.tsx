import assume from 'assume';
import { describe, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { DefaultExample } from '../examples/default';
import { NumberFieldControlledExample } from '../examples/controlled';
import { NumberFieldDisabledExample } from '../examples/disabled';
import { NumberFieldFormatOptionsExample } from '../examples/format-options';
import { NumberFieldHideStepperExample } from '../examples/hide-stepper';
import { NumberFieldInvalidExample } from '../examples/invalid';
import { NumberFieldValueScaleExample } from '../examples/value-scale';
import { waitForSelector } from '#test/utils/wait-for-selector.ts';

describe('@godaddy/antares', function antares() {
  describe('#NumberField', function numberField() {
    describe('#basic', function basic() {
      it('renders label and input with placeholder', async function renders() {
        const { locator, container } = await render(<DefaultExample />);
        const input = locator.getByRole('textbox', { name: 'Quantity' });

        assume(locator.getByText('Quantity').element()).exists();
        assume(input.element().getAttribute('placeholder')).equals('0');

        await waitForSelector(container, 'svg');

        assume(container.querySelector('svg[data-icon="minus"]')).exists();
        assume(container.querySelector('svg[data-icon="plus"]')).exists();
      });
    });

    describe('#controlled', function controlled() {
      it('updates value when user types', async function updatesValue() {
        const { locator } = await render(<NumberFieldControlledExample />);
        const input = locator.getByRole('textbox', { name: 'Quantity' });

        await input.fill('25');

        assume(input.element().getAttribute('value')).equals('25');
      });
    });

    describe('#invalid', function invalid() {
      it('renders error message and data-invalid on frame and input', async function invalidState() {
        const { locator } = await render(<NumberFieldInvalidExample />);
        const frame = locator.getByRole('group').element();
        const input = locator.getByRole('textbox', { name: 'Quantity' }).element();

        assume(locator.getByText('Please enter a value between 0 and 100').element()).exists();
        assume(frame.getAttribute('data-invalid')).equals('true');
        assume(input.getAttribute('data-invalid')).equals('true');
      });
    });

    describe('#disabled', function disabled() {
      it('renders disabled input and data-disabled on frame', async function disabledState() {
        const { locator } = await render(<NumberFieldDisabledExample />);
        const input = locator.getByRole('textbox', { name: 'Quantity' }).element();
        const frame = locator.getByRole('group').element();

        assume(input.hasAttribute('disabled')).equals(true);
        assume(frame.getAttribute('data-disabled')).equals('true');
      });
    });

    describe('#hideStepper', function hideStepper() {
      it('renders without increment and decrement buttons', async function noStepperButtons() {
        const { locator, container } = await render(<NumberFieldHideStepperExample />);
        const input = locator.getByRole('textbox', { name: 'Quantity' });

        assume(input.element()).exists();
        const buttons = await locator.getByRole('button').all();
        assume(buttons.length).equals(0);

        const icons = container.querySelectorAll('svg');
        assume(icons.length).equals(0);
      });
    });

    describe('#valueScale', function valueScale() {
      it('renders label and input with step from minimum', async function valueScaleRenders() {
        const { locator } = await render(<NumberFieldValueScaleExample />);
        assume(locator.getByText('Step value').element()).exists();
        assume(locator.getByRole('textbox', { name: 'Step value' }).element().getAttribute('placeholder')).equals('2');
      });
    });

    describe('#formatOptions', function formatOptions() {
      it('renders with custom numbering system', async function formatOptionsRenders() {
        const { locator } = await render(<NumberFieldFormatOptionsExample />);
        assume(locator.getByText('Number (Devanagari)').element()).exists();
        const value = locator.getByRole('textbox', { name: 'Number (Devanagari)' }).element().getAttribute('value');
        assume(value != null && value.length > 0).equals(true);
      });
    });

    describe('#stepper', function stepper() {
      it('renders increment and decrement buttons that are clickable', async function stepperRendersAndClicks() {
        const { locator } = await render(<DefaultExample defaultValue={10} />);
        const incrementButton = locator.getByRole('button', { name: 'Increase Quantity' });
        const decrementButton = locator.getByRole('button', { name: 'Decrease Quantity' });

        assume(incrementButton.element()).exists();
        assume(decrementButton.element()).exists();

        await incrementButton.click();
        assume(locator.getByRole('textbox', { name: 'Quantity' }).element().getAttribute('value')).equals('11');

        await decrementButton.click();
        assume(locator.getByRole('textbox', { name: 'Quantity' }).element().getAttribute('value')).equals('10');
      });
    });
  });
});
