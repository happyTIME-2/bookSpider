const redis = require('redis');

const { RedisConfig } = require('../config');

const client = redis.createClient(RedisConfig);

export default client;