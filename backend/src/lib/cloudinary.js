const cloudinary = require('cloudinary').v2;
const { envBool, envString } = require('./env');

function getCloudinaryErrMessage(err) {
  return String(
    err?.error?.message ||
      err?.message ||
      err?.error ||
      ''
  );
}

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function initCloudinary() {
  if (!isCloudinaryConfigured()) return false;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return true;
}

async function uploadToCloudinary(
  localFilePath,
  { folder = 'noteflow', resourceType = 'auto', forceLargeUpload = false } = {}
) {
  if (!isCloudinaryConfigured()) return null;
  initCloudinary();

  const useLargeUpload = forceLargeUpload || envBool('CLOUDINARY_USE_LARGE_UPLOAD', false);
  const accessMode = envString('CLOUDINARY_ACCESS_MODE', '');

  const uploadFn = useLargeUpload
    ? cloudinary.uploader.upload_large.bind(cloudinary.uploader)
    : cloudinary.uploader.upload.bind(cloudinary.uploader);

  const baseOptions = {
    folder,
    resource_type: resourceType,
    type: 'upload',
    use_filename: true,
    unique_filename: true,
  };

  const optionsWithAccess = {
    ...baseOptions,
    ...(accessMode ? { access_mode: accessMode } : {}),
  };

  let res;
  try {
    res = await uploadFn(localFilePath, optionsWithAccess);
  } catch (e) {
    const msg = getCloudinaryErrMessage(e);
    const lower = msg.toLowerCase();

    // Some Cloudinary accounts/plans can reject access_mode. Retry once without it.
    if (accessMode && (lower.includes('access_mode') || lower.includes('access mode')) && lower.includes('invalid')) {
      res = await uploadFn(localFilePath, baseOptions);
    } else {
      // Preserve the original error message for upstream mapping/logging.
      e.message = msg || e.message;
      throw e;
    }
  }

  return {
    url: res.secure_url,
    publicId: res.public_id,
    resourceType: res.resource_type,
  };
}

module.exports = { isCloudinaryConfigured, uploadToCloudinary };
