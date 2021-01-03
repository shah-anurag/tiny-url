const mongoose = require('mongoose')

const UsedKeysSchema = mongoose.Schema({
    _id: Number,
    longUrl: String
}, {collection: 'UsedKeys'})

module.exports = mongoose.model('UsedKeys', UsedKeysSchema);