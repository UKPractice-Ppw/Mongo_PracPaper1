const Student = require('../models/student.model');
const { setCache, getCache, expireCache, deleteCache } = require('../config/redis');

const CACHE_KEY = 'students:all';
const CACHE_TTL_SECONDS = 60;

function display(label, value) {
  console.log(`\n${label}`);
  console.log(JSON.stringify(value, null, 2));
}

// Cached fetch helper for all students
async function fetchAllStudentsWithCache() {
  const cached = await getCache(CACHE_KEY);
  if (cached) return { source: 'cache', students: cached };

  const students = await Student.find({}).lean();
  await setCache(CACHE_KEY, students);
  await expireCache(CACHE_KEY, CACHE_TTL_SECONDS);
  return { source: 'db', students };
}

async function runStudentOperations() {
  // Clear cache at start of run
  await deleteCache(CACHE_KEY);

  // Clear existing student collection for a clean run
  await Student.deleteMany({});

  // Q2 d) Attempt to save a separate test document with marks equal to 120 (Invalid)
  const invalidStudent = new Student({
    studentId: 'S_ERR',
    name: 'Invalid Test',
    age: 20,
    course: 'BCA',
    marks: 120, // Invalid: max is 100
    city: 'Surat'
  });

  try {
    await invalidStudent.validate();
  } catch (err) {
    console.log("Expected Marks Validation Error: " + err.errors.marks.message);
  }

  const invalidExists = await Student.exists({ studentId: 'S_ERR' });
  console.log('Invalid Student record Inserted? : ', Boolean(invalidExists));

  // Q3 A) Insert all five records (omitting isActive to test default true)
  const studentsData = [
    { studentId: 'S01', name: 'Asha', age: 21, course: 'MscIT', marks: 82, city: 'Surat' },
    { studentId: 'S02', name: 'Ravi', age: 23, course: 'MscIT', marks: 58, city: 'Ahmedabad' },
    { studentId: 'S03', name: 'Neha', age: 20, course: 'BCA', marks: 91, city: 'Surat' },
    { studentId: 'S04', name: 'Imran', age: 22, course: 'MscIT', marks: 70, city: 'Vadodara' },
    { studentId: 'S05', name: 'Kavya', age: 24, course: 'BCA', marks: 45, city: 'Rajkot' }
  ];

  const insertedStudents = await Student.insertMany(studentsData);
  await deleteCache(CACHE_KEY); // Invalidate cache after insert
  display('Create: Inserted five students', insertedStudents);

  // Q3 B a) Display all students (Demonstrating Cache Miss then Cache Hit)
  display('Fetch all #1 (expected source: db, then SET + EXPIRE)', await fetchAllStudentsWithCache());
  display('Fetch all #2 (expected source: cache)', await fetchAllStudentsWithCache());

  // Q3 B b) Display students whose city is Surat
  const suratStudents = await Student.find({ city: 'Surat' });
  console.log("\nStudents whose city is Surat:", suratStudents);

  // Q3 B c) Display students with marks at least 70, sorted by marks from highest to lowest
  const topStudents = await Student.find({ marks: { $gte: 70 } }).sort({ marks: -1 });
  console.log("\nStudents with marks >= 70 sorted highest to lowest:", topStudents);

  // Q3 C a) Change S02 marks to 65. Display the updated student.
  const updatedStudent = await Student.findOneAndUpdate(
    { studentId: 'S02' },
    { $set: { marks: 65 } },
    { returnDocument: 'after', runValidators: true }
  );
  await deleteCache(CACHE_KEY); // Invalidate cache after update
  console.log("\nUpdated S02 student:", updatedStudent);

  // Q3 C b) Set isActive to false for every BCA student. Display affected students.
  await Student.updateMany({ course: 'BCA' }, { $set: { isActive: false } });
  await deleteCache(CACHE_KEY); // Invalidate cache after update
  const bcaStudents = await Student.find({ course: 'BCA' });
  console.log("\nBCA Students (isActive set to false):", bcaStudents);

  // Verify fetch populates updated data from DB
  display('Fetch all #3 (expected source: db with updated data)', await fetchAllStudentsWithCache());

  // Q3 D a) Delete S05 using studentId and verify record no longer exists
  const deleteResult = await Student.deleteOne({ studentId: 'S05' });
  await deleteCache(CACHE_KEY); // Invalidate cache after delete
  console.log("\nDeleted Student S05 result:", deleteResult);

  const s05Exists = await Student.exists({ studentId: 'S05' });
  console.log("Does deleted student S05 exist?:", Boolean(s05Exists));
}

module.exports = { runStudentOperations };