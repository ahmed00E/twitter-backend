const { Schema, model } = require("mongoose")

const TweetSchema = Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId, ref: "User"
    },
    comments: [{
      type: Schema.Types.ObjectId, ref: "Comment"
    }],
    retweets: [{
      type: Schema.Types.ObjectId, ref: "User"
    }]
  }, {
    timestamps: true
  }
)

// apres avoir delete un tweet, on met a jour le user en lui enlevant
// l'id du tweet qu'on vient de supprimer
TweetSchema.post('findOneAndDelete', async function(tweet) {
  await model('User').findOneAndUpdate(
    { _id: tweet.author },
    { $pull: { tweets: tweet._id } }
  )
})

// apres avoir sauvegardé un tweet en base de donnée, on met a jour le user en lui
// ajoutant l'id du tweet qu'on vient de créer
TweetSchema.post('save', async function(tweet) {
  await model('User').findByIdAndUpdate(
    { _id: tweet.author },
    { $push: { tweets: tweet._id } }
  )
})

const Tweet = model("Tweet", TweetSchema)
module.exports = Tweet