const Redis = require('ioredis');
const redisUrl = process.env.REDIS_URL || process.env.RREDIS_URL || 'redis://127.0.0.1:6379';

if (process.env.RREDIS_URL && !process.env.REDIS_URL) {
  console.warn('Warning: using deprecated RREDIS_URL env var. Rename it to REDIS_URL.');
}

if (!process.env.REDIS_URL && !process.env.RREDIS_URL) {
  console.warn('REDIS_URL is not set. Falling back to local Redis at redis://127.0.0.1:6379');
}

const redis = new Redis(redisUrl);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

module.exports = redis;