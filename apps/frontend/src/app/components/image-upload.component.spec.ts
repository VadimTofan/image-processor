import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@angular/core', () => {
  const signal = <T>(initial: T) => {
    let v = initial;
    const s: any = () => v;
    s.set = (val: T) => {
      v = val;
    };
    return s;
  };

  const Component = (meta: any) => (cls: any) => cls;

  return {
    signal,
    Component,
    ChangeDetectionStrategy: { OnPush: 'OnPush' },
  };
});

vi.mock('@angular/common', () => ({ CommonModule: {} }));
vi.mock('@angular/common/http', () => ({ httpResource: () => undefined }));

describe('ImageUploadComponent', () => {
  let ImageUploadComponent: any;
  let originalFileReader: any;

  beforeEach(async () => {
    originalFileReader = (globalThis as any).FileReader;
    const mod = await import('./image-upload.component');
    ImageUploadComponent = mod.ImageUploadComponent;
  });

  afterEach(() => {
    (globalThis as any).FileReader = originalFileReader;
    vi.restoreAllMocks();
  });

  it('sets previewUrl when a file is selected and analyzeImage calls service with the file', () => {
    const component = new ImageUploadComponent();

    const analyzeSpy = vi.spyOn(component.service, 'analyzeImage');

    class MockFileReader {
      result: any = 'data:image/png;base64,FAKE';
      onload: ((ev: any) => void) | null = null;
      readAsDataURL(_file: File) {
        if (this.onload) this.onload({});
      }
    }

    (globalThis as any).FileReader = MockFileReader;

    const file = new File(['abc'], 'test.png', { type: 'image/png' });

    const fakeEvent = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(fakeEvent);

    expect(component.previewUrl()).toBe('data:image/png;base64,FAKE');

    component.analyzeImage();

    expect(analyzeSpy).toHaveBeenCalledWith(file);
  });

  it('formats the file sizes correctly', () => {
    const component = new ImageUploadComponent();

    expect(component.formatBytes(0)).toBe('0 Bytes');
    expect(component.formatBytes(500)).toBe('500 Bytes');
    expect(component.formatBytes(1024)).toBe('1 KB');

    expect(component.formatBytes(1500)).toBe('1.46 KB');

    expect(component.formatBytes(5 * 1024 * 1024)).toBe('5 MB');
  });
});
