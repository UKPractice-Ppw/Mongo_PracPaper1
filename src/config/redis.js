const Redis = require('ioredis');

// lazyConnect: connection is opened explicitly by connectRedis() from app.js.
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  lazyConnect: true,
  maxRetriesPerRequest: 1                                                                                                                                                                                                                                                               
});

async function connectRedis() {
  await redis.connect();
  console.log('Redis connected successfully.');
}

async function disconnectRedis() {
  await redis.quit(); 
  console.log('Redis connection closed.');
}

// SET: store a value under a key (objects are stored as JSON strings).
async function setCache(key, value) {
  return redis.set(key, JSON.stringify(value));
}

// GET: read a key; returns null on a cache miss.
async function getCache(key) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

// EXPIRE: give a key a time-to-live in seconds.
async function expireCache(key, seconds) {
  return redis.expire(key, seconds);
}

// DEL: remove a key (used to invalidate the cache after writes).
async function deleteCache(key) {
  return redis.del(key);
}

module.exports = { connectRedis, disconnectRedis, setCache, getCache, expireCache, deleteCache };