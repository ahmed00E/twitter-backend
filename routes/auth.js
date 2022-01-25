const express = require("express")
const app = express()
const bcrypt = require("bcrypt")

const passport = require("../config/passport")

const { verifyExistingUser } = require("../middlewares/users")
const User = require("../models/User")

app.post('/login',
  passport.authenticate("local"),
  (req, res) => {
    if (req.user) {
      req.logIn(req.user, err => {
        if (err) {
          res.status(401).json({ error: "Unauthorized" })
        } else {
          res.json(req.user)
        }
      })
    }
  }
)

app.post('/signup', verifyExistingUser, async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10)

    const newUser = await User.create({
      ...req.body,
      usertag: `@${req.body.username}`,
      password: hash
    })

    res.json(newUser)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: "Oups, something went wrong" })
  }
})

// route que j'appelle a chaque fois que je recharge mon front 
// si dans mon front j'ai un cookie qui correspond a ma session en backend,
// elle me renvoie mon req.user. en d'autre termes, si j'ai mon cookie dans mon
// front, le serveur va le lire et me renvoyer le user auquel il correspond.
// si j'ai plus de session (plus de req.user) avec mon cookie, c'est que
// j'ai été déconnecté.
// cette route est utile pour resté connecté meme si on ferme notre page, ou qu'on 
// la recharge.
// dans le front, je l'appelle dans le componentDidMount de mon context User
app.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user)
  } else {
    res.status(401).json({ error: "Unauthorized" })
  }
})

app.delete('/logout', (req, res) => {
  req.session.destroy()
  req.logout() 
  res.status(200).json({ success: "Sucess" })
})

module.exports = app