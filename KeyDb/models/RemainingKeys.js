const mongoose = require('mongoose')

const RemainingKeysSchema = mongoose.Schema({
    _id: Number,
    longUrl: String
}, {collection: 'RemainingKeys'})

module.exports = mongoose.model('RemainingKeys', RemainingKeysSchema);