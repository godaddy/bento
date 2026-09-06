import { describe, it, expect, beforeAll } from 'vitest';
import { render } from 'vitest-browser-react';
import { cdp, userEvent } from 'vitest/browser';
import assume from 'assume';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DropZone, Text } from '@godaddy/antares';
import { DefaultExample } from '../examples/default.tsx';
import { DisabledExample } from '../examples/disabled.tsx';
import { DropTargetLabelExample } from '../examples/drop-target-label.tsx';
import { FileUploadExample } from '../examples/file-upload.tsx';
import { ReplaceFileExample } from '../examples/replace-file.tsx';

// Dispatch a real drag-enter via Chrome DevTools Protocol so the DataTransfer is live
// and RAC's getDropOperation callback can access the MIME types correctly.
async function simulateFileDragEnter(element: HTMLElement): Promise<void> {
  const session = cdp();
  const elementRect = element.getBoundingClientRect();
  // Account for the iframe that vitest-browser uses to isolate tests
  const frameRect = (window.frameElement as HTMLElement)?.getBoundingClientRect() ?? { left: 0, top: 0 };
  const x = frameRect.left + elementRect.left + elementRect.width / 2;
  const y = frameRect.top + elementRect.top + elementRect.height / 2;
  await (session as unknown as { send: (m: string, p: unknown) => Promise<void> }).send('Input.dispatchDragEvent', {
    type: 'dragEnter',
    x,
    y,
    data: { items: [{ mimeType: 'image/jpeg', data: '' }], dragOperationsMask: 15 },
    modifiers: 0
  });
}

describe('@godaddy/antares', function antares() {
  describe('#DropZone', function dropZoneTests() {
    beforeAll(preloadTestIcons);

    // --- Default ---

    it('connects the label slot to the interactive element via aria-labelledby', async function ariaLabelSlot() {
      const { container } = await render(<DefaultExample />);
      const labelSpan = container.querySelector('[slot="label"]') as HTMLElement;
      assume(labelSpan).is.not.equal(null);
      assume(labelSpan.id).is.not.equal('');
      const btn = container.querySelector(`button[aria-labelledby*="${labelSpan.id}"]`);
      assume(btn).is.not.equal(null);
    });

    it('applies data-focus-visible when focused via keyboard', async function keyboardFocus() {
      const { container } = await render(<DefaultExample />);
      await userEvent.keyboard('{Tab}');
      assume(container.querySelector('[data-focus-visible]')).is.not.equal(null);
    });

    // --- Disabled ---

    it('applies data-disabled attribute and 0.4 opacity when disabled', async function disabledState() {
      const { container } = await render(<DisabledExample />);
      const el = container.querySelector('[data-disabled]') as HTMLElement;
      assume(el).is.not.equal(null);
      assume(Number(getComputedStyle(el).opacity)).equals(0.4);
    });

    // --- DropTargetLabel ---

    it('shows "Add files or drag them here." in resting state', async function dropTargetLabelResting() {
      const { getByText } = await render(<DropTargetLabelExample />);
      await expect.element(getByText('Add files or drag them here.')).toBeVisible();
    });

    it('shows "Drop files to upload." when a file is dragged over', async function dropTargetLabelActive() {
      const { container, getByText } = await render(<DropTargetLabelExample />);
      const dropZone = container.querySelector('[data-rac]') as HTMLElement;
      assume(dropZone).is.not.equal(null);
      await simulateFileDragEnter(dropZone);
      await expect.element(getByText('Drop files to upload.')).toBeVisible();
    });

    // --- FileUpload ---

    it('shows "Add files" and size limit text in resting state', async function fileUploadResting() {
      const { getByText } = await render(<FileUploadExample />);
      await expect.element(getByText('Add files')).toBeVisible();
      await expect.element(getByText('The file must be less than 256MB')).toBeVisible();
    });

    it('shows image preview and filename after selecting an image file', async function fileUploadImagePreview() {
      const { container, getByRole, getByText } = await render(<FileUploadExample />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      assume(input).is.not.equal(null);
      await userEvent.upload(input, new File(['x'], 'photo.jpg', { type: 'image/jpeg' }));
      await expect.element(getByRole('img', { name: 'photo.jpg' })).toBeVisible();
      await expect.element(getByText('photo.jpg')).toBeVisible();
    });

    it('shows file extension and filename after selecting a non-image file', async function fileUploadPdfPreview() {
      const { container, getByText } = await render(<FileUploadExample />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      assume(input).is.not.equal(null);
      await userEvent.upload(input, new File(['x'], 'document.pdf', { type: 'application/pdf' }));
      await expect.element(getByText('pdf', { exact: true })).toBeVisible();
      await expect.element(getByText('document.pdf')).toBeVisible();
    });

    // --- ReplaceFile ---

    it('shows "Add files" button in resting state', async function replaceFileResting() {
      const { getByText } = await render(<ReplaceFileExample />);
      await expect.element(getByText('Add files')).toBeVisible();
    });

    it('shows image preview and Replace button after selecting an image file', async function replaceFileFilledImage() {
      const { container, getByRole, getByText } = await render(<ReplaceFileExample />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      assume(input).is.not.equal(null);
      await userEvent.upload(input, new File(['x'], 'photo.png', { type: 'image/png' }));
      await expect.element(getByRole('img', { name: 'photo.png' })).toBeVisible();
      await expect.element(getByText('photo.png')).toBeVisible();
      await expect.element(getByText('Replace')).toBeVisible();
    });

    it('shows file extension, filename and Replace button after selecting a non-image file', async function replaceFileFilledPdf() {
      const { container, getByText } = await render(<ReplaceFileExample />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      assume(input).is.not.equal(null);
      await userEvent.upload(input, new File(['x'], 'report.pdf', { type: 'application/pdf' }));
      await expect.element(getByText('pdf', { exact: true })).toBeVisible();
      await expect.element(getByText('report.pdf')).toBeVisible();
      await expect.element(getByText('Replace')).toBeVisible();
    });

    it('shows "Drop to replace" when filled and a file is dragged over', async function replaceFilledDropTarget() {
      const { container, getByText } = await render(<ReplaceFileExample />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      assume(input).is.not.equal(null);
      await userEvent.upload(input, new File(['x'], 'photo.png', { type: 'image/png' }));
      const dropZone = container.querySelector('[data-rac]') as HTMLElement;
      assume(dropZone).is.not.equal(null);
      await simulateFileDragEnter(dropZone);
      await expect.element(getByText('Drop to replace')).toBeVisible();
    });

    // --- className ---

    it('applies a custom string className', async function customClassName() {
      const { container } = await render(
        <DropZone
          aria-label="Test"
          onDrop={function noop() {
            /* noop */
          }}
          className="custom-class"
        >
          <Text slot="label">Drop here</Text>
        </DropZone>
      );
      assume(container.querySelector('.custom-class')).is.not.equal(null);
    });
  });
});
