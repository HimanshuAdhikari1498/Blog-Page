const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Post = require('../models/Post')



// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Post.create(req.body)
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    User Blog
// @route   GET /posts/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId,
    })
      .populate('user')
      .lean()

    res.render('posts/user_post', {
      posts,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    Show edit page
// @route   GET /posts/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
    }).lean()

    if (!post) {
      return res.render('error/404')
    }

    if (post.user != req.user.id) {
      res.redirect('/')
    } else {
      res.render('posts/edit', {
        post,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /posts/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean()

    if (!post) {
      return res.render('error/404')
    }

    if (post.user != req.user.id) {
      res.redirect('/')
    } else {
      post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean()

    if (!post) {
      return res.render('error/404')
    }

    if (post.user != req.user.id) {
      res.redirect('/')
    } else {
      await Post.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})



module.exports = router