const express = require('express');
const { getStudents, addStudent, deleteStudent } = require('../controllers/student.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.route('/')
    .get(protect, getStudents)
    .post(protect, addStudent);

router.route('/:id')
    .delete(protect, deleteStudent);

module.exports = router;
