import { v2 as cloudinary } from 'cloudinary';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed.' });
    }

    if (req.file.size > MAX_IMAGE_SIZE_BYTES) {
      return res.status(400).json({ success: false, message: 'File size must be less than 5MB' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'image',
      folder: 'chat-images',
    });

    res.json({
      success: true,
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};
