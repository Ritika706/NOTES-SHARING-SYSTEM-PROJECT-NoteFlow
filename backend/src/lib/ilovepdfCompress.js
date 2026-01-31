const path = require('path');
const fs = require('fs');

const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');

const { envString } = require('./env');

function isILovePdfConfigured() {
  return Boolean(envString('ILOVEPDF_PUBLIC_KEY') && envString('ILOVEPDF_SECRET_KEY'));
}

function toSafeLevel(level) {
  const v = String(level || '').trim().toLowerCase();
  if (!v) return 'recommended';
  if (['extreme', 'recommended', 'low'].includes(v)) return v;
  return 'recommended';
}

async function compressPdfWithILovePdf(inputPath, { compressionLevel = 'recommended' } = {}) {
  if (!inputPath) throw new Error('inputPath is required');

  const publicKey = envString('ILOVEPDF_PUBLIC_KEY');
  const secretKey = envString('ILOVEPDF_SECRET_KEY');
  if (!publicKey || !secretKey) {
    throw new Error('ILovePDF credentials missing (set ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY)');
  }

  const level = toSafeLevel(compressionLevel);

  const instance = new ILovePDFApi(publicKey, secretKey);
  const task = instance.newTask('compress');

  try {
    await task.start();
    const file = new ILovePDFFile(inputPath);
    await task.addFile(file);
    await task.process({ compression_level: level });

    const data = await task.download();
    const outDir = path.dirname(inputPath);
    const base = path.basename(inputPath, path.extname(inputPath));
    const outPath = path.join(outDir, `${base}_${Date.now()}_ilovepdf.pdf`);

    await fs.promises.writeFile(outPath, data);

    return {
      path: outPath,
      size: Buffer.isBuffer(data) ? data.length : Number((data && data.byteLength) || 0),
      compressionLevel: level,
    };
  } catch (e) {
    const msg = String(e?.message || e);
    throw new Error(`iLovePDF compression failed: ${msg}`);
  }
}

module.exports = { compressPdfWithILovePdf, isILovePdfConfigured };
