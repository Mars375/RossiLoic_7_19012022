const multer = require('multer')
const fs = require('fs')
const path = require('path')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/x-msvideo': 'avi',
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/ogg': 'ogv',
  'video/mp2t': 'ts',
  'video/webm': 'webm',
  'video/3gpp': '3gp',
  'video/3gpp2': '3g2'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = path.join(__dirname, '..', 'tmp', 'uploads')
    // Vérifie si le répertoire existe, sinon le crée
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    callback(null, dir)
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0]
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
  }
})

module.exports = multer({ storage: storage }).single('image')