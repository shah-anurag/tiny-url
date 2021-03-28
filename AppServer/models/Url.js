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
        required: true,
        default: function () {
            presentDate = new Date();
            console.log(presentDate);
            presentDate.setMonth(presentDate.getMonth() + 6);
            return presentDate;
        } // https://mongoosejs.com/docs/schematypes.html#dates
    }
}, {collection: 'URL'})

module.exports = mongoose.model('Url', UrlSchema)