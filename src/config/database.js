const mongoose = require('mongoose');

async function connectDatabase() {
  const { MONGODB_URI, ROLL_NO } = process.env;
  if (!MONGODB_URI || !ROLL_NO || !/^[A-Za-z0-9_-]+$/.test(ROLL_NO)) {
    throw new Error('Set MONGODB_URI and a valid ROLL_NO in .env.');
  }
  const dbName = `practice_students_${ROLL_NO}`;
  await mongoose.connect(MONGODB_URI, { dbName, serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected successfully. Database: ${dbName}`);
}

async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
}

module.exports = { connectDatabase, disconnectDatabase };