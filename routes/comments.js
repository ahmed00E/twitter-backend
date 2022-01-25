const express = require("express")
const Comment = require("../models/Comment")
const User = require("../models/User")
const Tweet = require("../models/Tweet")
const app = express()

const { isAuthentified } = require("../middlewares/users")

app.post('/', isAuthentified, async (req, res) => {
  const { author, tweet, content } = req.body

  const comment = await Comment.create({
    content,
    author,
    tweet
  })

  await User.updateOne(
    { _id: author },
    { $push: { comments: comment._id } }
  )

  await Tweet.updateOne(
    { _id: tweet },
    { $push: { comments: comment._id } }
  )

  res.json(comment)
})

module.exports = app