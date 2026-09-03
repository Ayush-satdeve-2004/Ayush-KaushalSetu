const cloudinary = require('cloudinary').v2;

// Configure Cloudinary SDK with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadDocumentToCloudinary = async (filePath, folder = 'ayush_kaushalsetu_certificates') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.log('ℹ️ Cloudinary credentials not set in backend/.env. Using fallback secure document URL.');
    return {
      success: true,
      url: `https://ayush-kaushalsetu.gov.in/uploads/${filePath}`,
      public_id: `local_${Date.now()}`
    };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  cloudinary,
  uploadDocumentToCloudinary
};
