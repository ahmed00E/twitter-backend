require('dotenv').config()
const express = require("express")
const app = express()
const port = process.env.PORT
const mongoose = require("mongoose")
const passport = require("./config/passport")
const cors = require("cors")
const session = require("express-session")

require("./models/Tweet")
require("./models/User")

const authRoutes = require("./routes/auth")
const usersRoutes = require("./routes/users")
const tweetsRoutes = require("./routes/tweets")
const retweetsRoutes = require("./routes/retweets")
const commentsRoutes = require("./routes/comments")

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on("erro", err => console.log(err))
db.once("open", () => console.log("Connected to db"))

app.use(express.json())
app.use(cors({
  origin: process.env.ALLOWED_DOMAIN,
  credentials: true
}))
app.use(express.static('public'))

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/tweets', tweetsRoutes)
app.use('/retweets', retweetsRoutes)
app.use('/comments', commentsRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
