const express = require('express')

const posts = require('./posts')
const auth = require('./auth')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/posts', posts)
router.use('/users', auth)

module.exports = router
