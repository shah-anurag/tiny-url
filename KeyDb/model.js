const usedKeysModel = require('./models/UsedKeys');
const remainingKeysModel = require('./models/RemainingKeys');

const models = {
    usedKeys: usedKeysModel,
    remainingKeys: remainingKeysModel
};

module.exports = models;