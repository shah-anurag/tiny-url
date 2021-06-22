const mongoose = require('mongoose')

const TokenSchema = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    }
}, { collection: 'Token'})

module.exports = TokenSchema