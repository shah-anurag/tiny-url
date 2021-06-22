const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now
    },
    refreshToken: {
        type: String,
        required: false
    }
}, {collection: 'User'})

module.exports = mongoose.model('User', UserSchema)