const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStudent = async (req, res) => {
    try {
        const { name, email, rollNumber } = req.body;
        const newStudent = await Student.create({ name, email, rollNumber });
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
