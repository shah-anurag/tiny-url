const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const models = require('../model');
const simpleDAO = require('../DAO/simpleDAO');

var connection = async () => { 
    const url = 'mongodb://127.0.0.1:27017/key-db'
    try {
      await mongoose.connect( url, {useNewUrlParser: true, useUnifiedTopology: true});
      console.log("Connection to url:", url, "successful");
      return true;
    } catch(err) {
      console.error("Couldnt connect to", url, err);
      return false;
    }
  };

var getShortUrl = async function() {
    if (!await connection()) {
    console.log("Exiting as attempt tp connect to database was unsuccessfull");
    process.exit(1);
    }
    try {
        shortUrl = await simpleDAO.findOneAndDelete({}, models.remainingKeys);
        await simpleDAO.save({_id: shortUrl._id}, models.usedKeys);
        return shortUrl;
    } catch(err) {
        console.error("Error while fetching shortUrl:", err);
    }
    return null;
}

module.exports = getShortUrl;