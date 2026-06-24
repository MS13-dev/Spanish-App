// Génère des icônes PNG carrées de couleur unie (terracotta) avec un disque clair,
// suffisantes comme icônes PWA de départ. Sans dépendance externe.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(size, bg, fg) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.34;
  const raw = Buffer.alloc(size * (size * 3 + 1));
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const inCircle = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
      const c = inCircle ? fg : bg;
      raw[o++] = c[0];
      raw[o++] = c[1];
      raw[o++] = c[2];
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const terracotta = [199, 91, 57];
const cream = [255, 246, 236];
const outDir = path.join(__dirname, '..', 'public');
for (const size of [192, 512]) {
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), makePng(size, terracotta, cream));
  console.log(`icon-${size}.png généré`);
}
