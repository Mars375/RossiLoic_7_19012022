const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'tmp', 'uploads')
const maxAge = 24 * 60 * 60 * 1000 // 1 jour en millisecondes

function cleanup() {
  fs.readdir(dir, (err, files) => {
    if (err) throw err

    files.forEach(file => {
      const filePath = path.join(dir, file)
      fs.stat(filePath, (err, stats) => {
        if (err) throw err

        if (Date.now() - stats.mtimeMs > maxAge) {
          fs.unlink(filePath, err => {
            if (err) throw err
            console.log(`Fichier supprimé : ${filePath}`)
          })
        }
      })
    })
  })
}

module.exports = cleanup