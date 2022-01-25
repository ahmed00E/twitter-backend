const express = require("express");
const app = express()

const User = require("../models/User")

const { isAuthentified } = require("../middlewares/users")

app.get('/', async (req, res) => {
  const users = await User.find()

  res.json(users)
})

app.get('/:username', async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ username })
    .populate({
      path: 'tweets',
      populate: {
        path: 'author'
      }
    })
    .populate({
      path: 'retweets',
      model: 'Tweet'
    })
    .populate('followers', 'username usertag')
    .populate('followings', 'username usertag')

  res.json(user)
})

app.put('/:id', async (req, res) => {
  const { id } = req.params

  const user = await User.findOneAndUpdate(
    { _id: id },
    { $set: { ...req.body } },
    { new: true }
  )

  res.json(user)
})

app.post('/follow', isAuthentified, async (req, res) => {
  const { profileId } = req.body

  try {
      await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { followings: profileId } },
      { new: true }
    )

    await User.findOneAndUpdate(
      { _id: profileId },
      { $push: { followers: req.user._id } },
      { new: true }
    )

    res.json({ success: "Follow" })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e })
  } 
})

app.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await User.deleteOne({ _id: id })
    res.json({ success: "User deleted" })
  } catch (e) {
    console.log(e)
  }
})

module.exports = app