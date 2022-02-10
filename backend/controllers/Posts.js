const PostModel = require('../models/Post')
const UserModel = require('../models/User')

module.exports.getOnePost = async (req, res) => {
  try {
    const post = await PostModel.findONe({ where : { id: req.params.id } })
    if (!post)
      return res.status(404).json({ message: "Post has not been found" })
    res.status(200).json({ post })
  }
  catch(error) {
    res.status(500).json({ error })
  }
}

module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.findAll()
    if (!posts.length)
      return res.status(404).json({
      message: 'Post has not been found'
    })
    res.status(200).json({ posts })
  } 
  catch (error) {
    res.status(500).json({ error })
  }
}

module.exports.getTenPost = (req, res) => {

}

module.exports.getAllPostCategory = (req, res) => {
  
}

module.exports.createPost = async (req, res) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }))
  }
  catch {

  }
}
module.exports.updatePost = (req, res) => {
  
}

module.exports.deletePost = (req, res) => {
  
}