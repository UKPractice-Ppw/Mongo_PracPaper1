```md
# MongoDB + Redis Student Practice Project

This project is a simple Node.js application that demonstrates how to work with MongoDB and Redis in a real database workflow. It creates a student dataset, validates records, inserts sample student data, fetches filtered results, updates data, and deletes records. It also shows how Redis caching can be used to store and reuse the “all students” data for faster access.

## What this project does
- Connects to MongoDB using Mongoose
- Defines a `Student` schema with validation rules
- Inserts multiple student records
- Fetches all students and filters by city
- Finds students with marks above a threshold
- Updates a student’s marks
- Updates all BCA students as inactive
- Deletes a student record
- Uses Redis to cache the “all students” query and demonstrate cache hit/miss behavior

## Tech Stack
- Node.js
- MongoDB
- Mongoose
- Redis
- ioredis
- dotenv

## Project Structure
- `src/app.js` – entry point of the application
- `src/config/database.js` – MongoDB connection setup
- `src/config/redis.js` – Redis connection and cache functions
- `src/models/student.model.js` – Student schema
- `src/services/student.service.js` – CRUD and caching logic

## Setup
1. Install the required packages:
   ```bash
   npm install mongoose ioredis dotenv
   ```

2. Create a `.env` file in the project root:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ROLL_NO=your_roll_number
   REDIS_URL=redis://127.0.0.1:6379
   ```

3. Make sure MongoDB and Redis are running locally or in your environment.

4. Run the app:
   ```bash
   node src/app.js
   ```
