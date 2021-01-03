const mongoose = require('mongoose');
const models = require('./model');
const simpleDAO = require('./DAO/simpleDAO');

var connection = (async () => { 
  const url = 'mongodb://127.0.0.1:27017/key-db'
  try {
    await mongoose.connect( url, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Connection to url:", url, "successful");
    return true;
  } catch(err) {
    console.error("Couldnt connect to", url);
    return false;
  }
})();

if (!connection) {
  console.log("Exiting as attempt tp connect to database was unsuccessfull");
  process.exit(1);
}

console.log("##########\tWelcome to generateKeys!\t##########");

var generateKey = function() {
  const key = Math.floor(100 + Math.random() * 900);
  console.log("Created random number:", key);
  return key;
}

var checkIfAlreadyInDb = async function(id, model) {
  // return await model.findById(id).exec() == null ? false : true;
  return await simpleDAO.findById(id, model) == null ? false : true;
}

var checkIfAlreadyInDbForAllModels = async function(id, models) {
  var isAlreadyUsed = false;
  for(const modelName in models) {
    if(checkIfPropIsOfAnObjectAndNotInherited(modelName, models)) {
      const model = models[modelName];
      if(await checkIfAlreadyInDb(id, model)) {
        console.log("Key:", id ,"already present in", modelName);
        isAlreadyUsed = true;
        break;
      }
    }
  }
  if(!isAlreadyUsed) {
    console.log("Key:", id ,"not present");
  }
  return isAlreadyUsed;
}

var checkIfPropIsOfAnObjectAndNotInherited = function(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/** 
 * @param {Object} record
 * @param {mongoose.Model} Model
*/
var InsertInDb = async function(record, Model) {
  console.log("In InsertInDb(): with record:", record, "and Model:", Model);
  if( (! Model instanceof mongoose.Model) || (record._id == null)) {
    return false;
  }
  try {
    // const newEntry = new Model(record);
    // await newEntry.save();
    await simpleDAO.save(record, Model);
  } catch(err) {
    console.error("Error while saving:", record, "in Model", Model, err);
    return false;
  }
  console.log("Successfully inserted", record, " in ", Model);
  return true;
}

setInterval(async () => {
  console.info("Generating keys in key-db");

    try {
      var count1 = await models.usedKeys.estimatedDocumentCount().exec();
      var count2 = await models.remainingKeys.estimatedDocumentCount().exec();

      //  TODO: Have the rate of increase of keys logic integrated
      //  TODO: Have batch insert logic
      //  Have at least twice the already used keys
      while (count2 <= 2 * count1 || count2 <= 10) {
        const generatedShortUrl = generateKey();
        const isUsed = await checkIfAlreadyInDbForAllModels(generatedShortUrl, models);
        if(! isUsed) {
          const isSuccessfulInsert = await InsertInDb({ _id: generatedShortUrl }, models.remainingKeys);
          if(isSuccessfulInsert) {
            count2++;
          }
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch(err) {
      console.error(err);
    }
}, 1000 * 5);