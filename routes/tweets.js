const express = require("express");
const app = express()

const Tweet = require("../models/Tweet")

const { isAuthentified } = require("../middlewares/users")

app.post('/', isAuthentified, async (req, res) => {
  const tweet = await Tweet.create({ ...req.body })
  res.json(tweet)
})

app.delete('/:id', async (req, res) => {
  const { id } = req.params

  await Tweet.findOneAndDelete({ _id: id })
})

app.get('/feed', async (req, res) => {
  if (req.user) {
    console.log(req.user)

    const authorIds = [ ...req.user.followings, req.user._id ]

    const tweets = await Tweet.find({ author: { $in: authorIds } })
      .sort({ createdAt: '-1' })
      .populate('author')

    res.json(tweets)
  } else {
    const tweets = await Tweet.find()
      .sort({ createdAt: '-1' })
      .populate('author')
  
    res.json(tweets)
  }
})

app.get('/:_id', async (req, res) => {
  const { _id } = req.params

  const tweet = await Tweet.findById(_id)
    .populate('author')
    .populate('retweets', 'username usertag createdAt')
    .populate({
      path: 'comments',
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: 'author'
      },
    })
    // .populate({
    //   path: 'comments',
    //   model: 'Comment'
    // })

  res.json(tweet)
})

module.exports = app