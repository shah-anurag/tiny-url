const redisHelper = require('../redis/helper');
const JSON = require('JSON');

class cachedDAO {
    static redis_client = redisHelper.getRedisClient();

    static async findById(id, Model) {
        console.log("Inside findById with id", id, "Model:", Model);
        let record = await this.redis_client.get(id);
        if(record !== null) {
            console.log('record fetched from redis');
        } else {
            record = await Model.findById(id).exec();
            this.redis_client.setex(id, redisHelper.EXPIRATION_TIME_IN_SECONDS, record);
        }
        return record;
    };

    static async findOne(filter, Model, cacheId) {
        console.log("Inside findOne with filter", filter, "Model:", Model);
        let record = null;
        if(cacheId) {
            record = JSON.parse(await this.redis_client.getAsync(cacheId));
        }
        if(!record) {
            console.log('Could not fetch from cache');

            // Fetch from db
            record = await Model.findOne(filter).exec();
            
            // If valid cacheId and existing record fill in the cache
            if(cacheId && record) {
                // Set value in cache
                console.log(`Setting ${cacheId} in cache`);
                this.redis_client.setex(cacheId, redisHelper.EXPIRATION_TIME_IN_SECONDS, JSON.stringify(record));
            }
        } else {
            record.fromCache = true;
            console.log(`Voilla! A cache hit.. yum yum`);
        }
        return record;
    }

    static async findOneAndDelete(filter, Model) {
        console.log("Inside findOneAndDelete with filter", filter, "Model:", Model);
        const record = await this.findOne(filter, Model);
        console.log("record", record);
        await this.delete(record._id, Model);
        return record;
        // return await Model.findOneAndDelete(filter).exec();
    }

    static async save(record, Model) {
        console.log("Inside save with record", record, "Model:", Model);
        const newEntry = new Model(record);
        console.log("newEntry", newEntry);
        await newEntry.save();
    }

    static async delete(id, Model) {
        console.log("Inside delete with id", id, "Model:", Model);
        return await Model.findByIdAndRemove(id).exec();
    }
}

module.exports = cachedDAO;