const passport = require("passport")
const passportLocal = require("passport-local")
const User = require("../models/User")
const bcrypt = require("bcrypt")

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username })
  
  if (!user) {
    return done(null, false)
  }

  const passwordValid = await bcrypt.compare(password, user.password)

  if (!passwordValid) {
    return done(null, false)
  }

  return done(null, user)
}))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

module.exports = passport