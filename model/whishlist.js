const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'user'
  },
  products: [
    {
      product: {
        type: String,
        ref: 'product'
      }
    }
  ]
})

module.exports = mongoose.model('Wishlist', wishlistSchema)