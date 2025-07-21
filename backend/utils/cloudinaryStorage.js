const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'restaurant',
    allowed_formats: ['jpg', 'png'],
  },
});

module.exports = storage;