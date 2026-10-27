const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 18 },
  course: { type: String, required: true, enum: ['MscIT', 'BCA'] },
  marks: { type: Number, required: true, min: 0, max: 100 },
  city: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Student', studentSchema, 'students');