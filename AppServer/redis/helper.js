const redis = require('redis')
const { promisifyAll } = require('bluebird');

// Required to use async await with redis - https://docs.redislabs.com/latest/rs/references/client_references/client_nodejs/#promises-and-asyncawait
promisifyAll(redis);

class RedisHelper {
    static REDIS_PORT = process.env.REDIS_PORT || 6379;
    static redis_client = redis.createClient(this.REDIS_PORT);
    static EXPIRATION_TIME_IN_SECONDS = 30 * 60; // 30 minutes

    static getRedisClient() {
        if(this.redis_client) return this.redis_client;
        else throw `Could not connect to redis`;
    }
    
}

module.exports = RedisHelper