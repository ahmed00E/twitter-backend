const { Schema, model } = require("mongoose")

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true
    },
    usertag: {
      type: String
    },
    password: {
      type: String,
      required: true,
      min: 8
    },
    email: {
      type: String
    },
    birthDate: {
      type: Date
    },
    bio: {
      type: String
    },
    location: {
      type: String
    },
    website: {
      type: String
    },
    phone: {
      type: String
    },
    pictureUrl: {
      type: String
    },
    bio: {
      type: String
    },
    tweets: [{
      type: Schema.Types.ObjectId, ref: "Tweet"
    }],
    retweets: [{
      type: Schema.Types.ObjectId, ref: "User"
    }],
    comments: [{
      type: Schema.Types.ObjectId, ref: "Comment"
    }],
    followers: [{
      type: Schema.Types.ObjectId, ref: "User"
    }],
    followings: [{
      type: Schema.Types.ObjectId, ref: "User"
    }],
  },
  {
    timestamps: true
  }
)



const User = model("User", UserSchema)

module.exports = User