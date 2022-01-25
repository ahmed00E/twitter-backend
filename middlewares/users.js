const User = require("../models/User")

const verifyExistingUser = async (req, res, next) => {
  const { username } = req.body

  const user = await User.findOne({ username }).exec()  

  if (user) {
    res.status(409).json({ error: "User already exists" })
  } else {
    next()
  }
}

const isAuthentified = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(401).json({ error: "Unauthorized" })
  }
}

module.exports = {
  verifyExistingUser,
  isAuthentified
}
