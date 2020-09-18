const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const { auth } = require('../middlewares')

// @route    GET api/post
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await Post.find()
    res.json(posts)
  } catch (error) {
    next(error)
  }
})

// @route    GET api/posts/:slug
// @desc     Get post by Slug
// @access   Private
router.get('/:slug', auth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (error) {
    console.error(error.message)
    next(error)
  }
})

// @route    POST api/posts/create
// @desc     Create a post
// @access   Private
router.post(
  '/compose',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('markdown', 'Markdown is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        name: user.name,
        user: req.user.id,
      })

      const post = await newPost.save()

      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route    DELETE api/posts/:slug
// @desc     Delete a post
// @access   Private
router.delete('/:slug', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    await post.remove()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)

    res.status(500).send('Server Error')
  }
})

module.exports = router
