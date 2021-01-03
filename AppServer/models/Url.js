const mongoose = require('mongoose')

const UrlSchema = mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrlId: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: false
    }
}, {collection: 'URL'})

module.exports = mongoose.model('Url', UrlSchema)