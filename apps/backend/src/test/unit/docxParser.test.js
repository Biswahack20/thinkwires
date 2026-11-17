import { describe, it, expect } from 'vitest';
import zlib from 'zlib';
import { extractTextFromDocxBuffer } from '../../services/ai.service.js';

describe('DOCX Text Extraction via Native Deflate', () => {
  it('safely returns empty string for null, undefined, or non-buffer inputs', () => {
    expect(extractTextFromDocxBuffer(null)).toBe('');
    expect(extractTextFromDocxBuffer(undefined)).toBe('');
    expect(extractTextFromDocxBuffer('not-a-buffer')).toBe('');
  });

  it('safely returns empty string for corrupt or non-zip buffers', () => {
    const corruptBuffer = Buffer.from('This is not a zip or docx file');
    expect(extractTextFromDocxBuffer(corruptBuffer)).toBe('');
  });

  it('accurately extracts text from a valid mock DOCX archive containing word/document.xml', () => {
    const xmlContent = '<w:document><w:body><w:p><w:t>John Doe</w:t></w:p><w:p><w:t>Full Stack Engineer</w:t></w:p></w:body></w:document>';
    const compressedXml = zlib.deflateRawSync(Buffer.from(xmlContent, 'utf8'));

    const fileName = 'word/document.xml';
    const fileNameBuf = Buffer.from(fileName, 'utf8');

    // Construct local file header: 30 bytes + filename + compressed data
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0); // PK\x03\x04
    header.writeUInt16LE(20, 4); // version needed
    header.writeUInt16LE(0, 6); // general purpose flags
    header.writeUInt16LE(8, 8); // compression method: 8 (Deflate)
    header.writeUInt16LE(0, 10); // file time
    header.writeUInt16LE(0, 12); // file date
    header.writeUInt32LE(0, 14); // crc32
    header.writeUInt32LE(compressedXml.length, 18); // compSize
    header.writeUInt32LE(xmlContent.length, 22); // uncompSize
    header.writeUInt16LE(fileNameBuf.length, 26); // fileNameLength
    header.writeUInt16LE(0, 28); // extraFieldLength

    const docxBuffer = Buffer.concat([header, fileNameBuf, compressedXml]);

    const extracted = extractTextFromDocxBuffer(docxBuffer);
    expect(extracted).toContain('John Doe');
    expect(extracted).toContain('Full Stack Engineer');
  });

  it('ignores non-document files and handles multiple zip entries cleanly', () => {
    const junkName = 'other.txt';
    const junkNameBuf = Buffer.from(junkName, 'utf8');
    const junkContent = Buffer.from('just junk content', 'utf8');

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0, 6);
    header.writeUInt16LE(0, 8); // stored (no compression)
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt32LE(0, 14);
    header.writeUInt32LE(junkContent.length, 18);
    header.writeUInt32LE(junkContent.length, 22);
    header.writeUInt16LE(junkNameBuf.length, 26);
    header.writeUInt16LE(0, 28);

    const zipBuffer = Buffer.concat([header, junkNameBuf, junkContent]);
    expect(extractTextFromDocxBuffer(zipBuffer)).toBe('');
  });
});
