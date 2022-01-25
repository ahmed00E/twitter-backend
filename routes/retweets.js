const express = require("express")
const User = require("../models/User")
const Tweet = require("../models/Tweet")
const app = express()

const { isAuthentified } = require("../middlewares/users")

app.post('/', isAuthentified, async (req, res) => {
  const { userId, tweetId } = req.body

  await User.updateOne(
    { _id: userId },
    { $push: { retweets: tweetId } }
  )

  await Tweet.updateOne(
    { _id: tweetId },
    { $push: { retweets: userId } }
  )

  res.json({ success: "Retweeted" })
})

module.exports = app