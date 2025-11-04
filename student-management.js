// Student Management System using MongoDB and MVC Architecture (Single File Version)

// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// ===== APP SETUP =====
const app = express();
app.use(bodyParser.json());

// ===== MONGOOSE MODEL =====
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// ===== CONTROLLER LOGIC =====

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new student
app.post('/students', async (req, res) => {
  const { name, age, course } = req.body;
  const student = new Student({ name, age, course });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
app.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'Student deleted',
      student: deletedStudent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== DATABASE CONNECTION =====
mongoose.connect('mongodb://localhost:27017/studentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log(err));

// ===== START SERVER =====
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
