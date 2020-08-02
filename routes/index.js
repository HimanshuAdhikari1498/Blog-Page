const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Post = require('../models/Post')

// @desc    Show all Blog
// @route   GET /
router.get('/', async (req, res) => {
  try {
    const posts = await  Post.find()
      .populate('user')
      .lean()

    res.render('home', {
      posts,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Login Page
// @route   GET /login
router.get('/login', ensureGuest, (req, res) => {
  res.render('login')
})

// @desc    Show add page
// @route   GET /posts/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('posts/add')
})


// @desc    Show single Post
// @route   GET /posts/:id
router.get('/posts/:id', async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).populate('user').lean()

    if (!post) {
      return res.render('error/404')
    }

    res.render('posts/post_info', {
      post,
    })
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      posts,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


module.exports = router