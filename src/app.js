require('dotenv').config();
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { connectRedis, disconnectRedis } = require('./config/redis');
const { runStudentOperations } = require('./services/student.service');

async function main() {
  try {
    await connectDatabase();
    try {
      await connectRedis();
    } catch {
      throw new Error('Redis connection failed. Check REDIS_URL and that Redis is running.');
    }

    await runStudentOperations();
    console.log('\nAll student tasks completed successfully.');
  } catch (error) {
    if (error.name === 'MongoServerError' || error.name === 'MongooseServerSelectionError') {
      console.error('Database operation/connection failed. Check Atlas access, credentials and network settings.');
    } else {
      console.error('Error:', error.message);
    }
    process.exitCode = 1;
  } finally {
    try {
      await disconnectDatabase();
    } catch {
      console.error('Could not close the MongoDB connection cleanly.');
      process.exitCode = 1;
    }
    try {
      await disconnectRedis();
    } catch {
      console.error('Could not close the Redis connection cleanly.');
      process.exitCode = 1;
    }
  }
}

main();