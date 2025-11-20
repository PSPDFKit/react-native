jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    findNodeHandle: jest.fn(),
  };
});

import { PDFDocument } from '../src/document/PDFDocument';
import { NativeModules, findNodeHandle } from 'react-native';

describe('PDFDocument JS helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getRef returns numeric reference when findNodeHandle returns null (Fabric fallback)', () => {
    (findNodeHandle as jest.Mock).mockReturnValue(null);
    const doc = new PDFDocument(1234);
    // @ts-ignore access private
    const ref = (doc as any).getRef();
    expect(ref).toBe(1234);
  });

  test('setPageIndex rejects out of bounds', async () => {
    const doc = new PDFDocument(5);
    (NativeModules.PDFDocumentManager.getPageCount as jest.Mock).mockResolvedValueOnce(3);
    await expect(doc.setPageIndex(10)).rejects.toBeInstanceOf(Error);
  });
});


