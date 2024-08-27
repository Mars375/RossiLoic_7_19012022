const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configurez Cloudinary avec vos informations d'API
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurez le stockage Cloudinary pour Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Dossier dans lequel les fichiers seront stockés sur Cloudinary
    format: async (req, file) => 'jpg', // Format de l'image
    public_id: (req, file) => file.originalname.split(' ').join('_').split('.')[0] + Date.now()
  }
});

const upload = multer({ storage: storage });

module.exports = upload.single('image');