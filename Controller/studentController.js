const studentServices = require('../Services/studentServices');

exports.studentRegister = async(req, res) => {
    try{
        const {code, message} = await studentServices.studentRegister(req.body)
        res.status(200).json({code:code, message:message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.studentLogin = async(req, res) => {
    try{
        const {code,message,token, studentId, accountState, accountType, email, name} = await studentServices.studentLogin(req.body);
        res.status(200).json({code, message, token, studentId, accountState, accountType, email, name});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.studentForgotPassword = async(req, res) => {
    try{
        const email = req.params.email;
        const {code,message} = await studentServices.studentForgotPassword(email)
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.studentCheckOtp = async(req, res) => {
    try{
        const {code,message} = await studentServices.studentCheckOtp(req.body)
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.studentUpdate = async(req, res) => {
    try{
        const studentId = req.params.id;
        const data = req.body
        const {code, message} = await studentServices.updateStudent(studentId,data);
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.studentUpdatePassword = async(req, res) => {
    try{
        const studentId = req.params.id;
        const data = req.body
        const {code,message} = await studentServices.studentUpdatePassword(studentId,data)
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.getByStudentId = async(req, res) => {
    try{
        const studentId = req.params.id;
        const {code,data} = await studentServices.getByStudentId(studentId)
        res.status(200).json({code,data});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.getAllStudent = async(req, res) => {
    try{
        const {code,data} = await studentServices.getAllStudent()
        res.status(200).json({code,data});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.deleteStudent = async(req, res) => {
    try{
        const studentId = req.params.id;
        const {code,message} = await studentServices.deleteStudent(studentId)
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.changeStudentState = async(req, res) => {
    try{
        const studentId = req.params.id;
        const state = req.body.state;
        const {code,message} = await studentServices.changeStudentState(studentId, state)
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.giveAditionalFolderAccess = async(req, res) => {
    try{
        const {code,message} = await studentServices.giveAditionalFolderAccess(req.body)
        res.status(200).json({code,message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}