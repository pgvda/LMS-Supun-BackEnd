const express = require('express');
const studentController = require('../Controller/studentController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/student/register',studentController.studentRegister);
router.post('/student/login',studentController.studentLogin);
router.put('/student/forgotpassword/:email',studentController.studentForgotPassword);
router.post('/student/checkotp',studentController.studentCheckOtp);
router.put('/student/update/:id',authenticateToken,studentController.studentUpdate);
router.put('/student/state/update/:id',authenticateToken,studentController.changeStudentState);
router.put('/student/updatepassword/:id',authenticateToken,studentController.studentUpdatePassword);
router.get('/student/getbyid/:id',authenticateToken,studentController.getByStudentId);
router.get('/student/getallstudents',authenticateToken,studentController.getAllStudent);
router.delete('/student/deletestudent/:id',authenticateToken,studentController.deleteStudent);

module.exports = router;