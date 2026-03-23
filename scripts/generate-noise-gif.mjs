/**
 * Generate an animated noise GIF for the film grain overlay.
 * 
 * Creates a small (64x64) tiled animated GIF with 8 frames of random noise.
 * The GIF uses the GIF89a format with a Netscape extension for infinite looping.
 * 
 * Output: public/grain.gif
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'public', 'grain.gif');

const WIDTH = 64;
const HEIGHT = 64;
const FRAMES = 8;
const DELAY = 5; // centiseconds (50ms per frame = 20fps)

// --- Minimal GIF89a encoder ---

function buildGif(width, height, frames, delay) {
  const parts = [];

  // Header
  parts.push(Buffer.from('GIF89a'));

  // Logical Screen Descriptor
  const lsd = Buffer.alloc(7);
  lsd.writeUInt16LE(width, 0);
  lsd.writeUInt16LE(height, 2);
  // Global Color Table flag=1, color resolution=7 (8 bits), sort=0, size=7 (256 colors)
  lsd[4] = 0xF7; // 1_111_0_111
  lsd[5] = 0; // background color index
  lsd[6] = 0; // pixel aspect ratio
  parts.push(lsd);

  // Global Color Table (256 grayscale entries)
  const gct = Buffer.alloc(256 * 3);
  for (let i = 0; i < 256; i++) {
    gct[i * 3] = i;
    gct[i * 3 + 1] = i;
    gct[i * 3 + 2] = i;
  }
  parts.push(gct);

  // Netscape Application Extension (infinite loop)
  parts.push(Buffer.from([
    0x21, 0xFF, 0x0B, // Application Extension header
    ...Buffer.from('NETSCAPE2.0'),
    0x03, 0x01,
    0x00, 0x00, // loop count = 0 (infinite)
    0x00 // block terminator
  ]));

  // Frames
  for (let f = 0; f < frames.length; f++) {
    // Graphic Control Extension
    parts.push(Buffer.from([
      0x21, 0xF9, 0x04,
      0x00, // disposal method: none, no user input, no transparency
      delay & 0xFF, (delay >> 8) & 0xFF, // delay
      0x00, // transparent color index (unused)
      0x00 // block terminator
    ]));

    // Image Descriptor
    const id = Buffer.alloc(10);
    id[0] = 0x2C; // Image separator
    id.writeUInt16LE(0, 1); // left
    id.writeUInt16LE(0, 3); // top
    id.writeUInt16LE(width, 5);
    id.writeUInt16LE(height, 7);
    id[9] = 0x00; // no local color table
    parts.push(id);

    // LZW compressed image data
    const minCodeSize = 8;
    parts.push(Buffer.from([minCodeSize]));

    // LZW encode the frame
    const lzwData = lzwEncode(frames[f], minCodeSize);
    
    // Write sub-blocks (max 255 bytes each)
    let offset = 0;
    while (offset < lzwData.length) {
      const chunkSize = Math.min(255, lzwData.length - offset);
      parts.push(Buffer.from([chunkSize]));
      parts.push(lzwData.slice(offset, offset + chunkSize));
      offset += chunkSize;
    }
    parts.push(Buffer.from([0x00])); // block terminator
  }

  // GIF Trailer
  parts.push(Buffer.from([0x3B]));

  return Buffer.concat(parts);
}

function lzwEncode(pixels, minCodeSize) {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;

  // Build initial code table
  const codeTable = new Map();
  for (let i = 0; i < clearCode; i++) {
    codeTable.set(String(i), i);
  }

  const output = [];
  let bitBuffer = 0;
  let bitCount = 0;

  function writeBits(code, size) {
    bitBuffer |= (code << bitCount);
    bitCount += size;
    while (bitCount >= 8) {
      output.push(bitBuffer & 0xFF);
      bitBuffer >>= 8;
      bitCount -= 8;
    }
  }

  // Write clear code
  writeBits(clearCode, codeSize);

  let indexBuffer = String(pixels[0]);

  for (let i = 1; i < pixels.length; i++) {
    const k = String(pixels[i]);
    const combined = indexBuffer + ',' + k;

    if (codeTable.has(combined)) {
      indexBuffer = combined;
    } else {
      writeBits(codeTable.get(indexBuffer), codeSize);

      if (nextCode < 4096) {
        codeTable.set(combined, nextCode);
        if (nextCode >= (1 << codeSize)) {
          codeSize++;
        }
        nextCode++;
      } else {
        // Reset
        writeBits(clearCode, codeSize);
        codeTable.clear();
        for (let j = 0; j < clearCode; j++) {
          codeTable.set(String(j), j);
        }
        codeSize = minCodeSize + 1;
        nextCode = eoiCode + 1;
      }

      indexBuffer = k;
    }
  }

  // Write remaining code
  writeBits(codeTable.get(indexBuffer), codeSize);
  // Write EOI
  writeBits(eoiCode, codeSize);

  // Flush remaining bits
  if (bitCount > 0) {
    output.push(bitBuffer & 0xFF);
  }

  return Buffer.from(output);
}

// --- Generate noise frames ---

function generateNoiseFrame(width, height, seed) {
  const pixels = new Uint8Array(width * height);
  // Simple PRNG for reproducible noise
  let state = seed;
  for (let i = 0; i < pixels.length; i++) {
    state = (state * 1103515245 + 12345) & 0x7FFFFFFF;
    // Generate grayscale noise — biased toward mid-tones for subtlety
    pixels[i] = (state >> 16) & 0xFF;
  }
  return pixels;
}

const noiseFrames = [];
for (let f = 0; f < FRAMES; f++) {
  noiseFrames.push(generateNoiseFrame(WIDTH, HEIGHT, (f + 1) * 7919));
}

const gifBuffer = buildGif(WIDTH, HEIGHT, noiseFrames, DELAY);
writeFileSync(OUTPUT, gifBuffer);

console.log(`✓ Generated animated noise GIF: ${OUTPUT}`);
console.log(`  Size: ${gifBuffer.length} bytes (${(gifBuffer.length / 1024).toFixed(1)} KB)`);
console.log(`  Dimensions: ${WIDTH}x${HEIGHT}`);
console.log(`  Frames: ${FRAMES}`);
console.log(`  Frame delay: ${DELAY * 10}ms`);
