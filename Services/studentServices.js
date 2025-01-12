const Student = require('../model/Student');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/genarateToken');
const genarateOtp = require('../utils/genarateOtp');
const sendOtpEmail = require('../utils/mailer');
const passwordValidate = require('../middleware/passwordValidator');
const validator = require('validator');
const { createRegNo } = require('../utils/createRegNo');
const { grantAccess } = require('../middleware/grantAccess');
const { authorize } = require('../utils/connectDrive');


exports.studentRegister = async(data)=> {
    try{
        const {
            name,
            email,
            batch,
            classType,
            whatsAppNo,
            additionalNo,
            district,
            scl,
            address,
            studentIdImg,
            password,
            historyType
        } = data

        const requiredField = {
            name,
            email,
            batch,
            classType,
            whatsAppNo,
            additionalNo,
            district,
            scl,
            address,
            studentIdImg,
            historyType,
            password
        };

        for(const [key, value] of Object.entries(requiredField)){
            if(!value){
                return{code:401,message:`${key} is required and cannot be null or empty.`};
            }
        }

        const student = await Student.findOne({email});
        
        if(student){
            return{code:401, message:'email already registered'}
        }
        const authClient = await authorize();
        const fileId = '1kQwlslbEuF6nv4pycVx1EXhavJGxbLk9';

        const isGiveAccess = await grantAccess(authClient,fileId, email)

        if(!isGiveAccess){
            return{code:405,message:'drive access denite'}
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const registerNo = await createRegNo({ batch: batch, classType: classType, historyType: historyType })
       
        newStudent = new Student ({
            name,
            email,
            accountType:'user',
            accountState:'active',
            batch,
            classType,
            whatsAppNo,
            additionalNo,
            district,
            scl,
            address,
            studentIdImg,
            password:hashedPassword,
            historyType,
            regNo:registerNo,
            otp:''

        })

        await newStudent.save();

        return {code:200,message:'student registered'}
    }catch(err){
        console.error(err);
        throw new Error('student cant register')
    }
}

exports.studentLogin = async(data) => {
    try{
        const {email,password} = data;
        const student = await Student.findOne({email});

        if(!student){
            return({code:401,message:'main student not found'})
        }
        const isMatch  = await bcrypt.compare(password, student.password);

        if(!isMatch) {
            return({code:400,message:'invalid login'});
        }

        const token = generateToken(student.id)

        console.log(token, student)

        return{code:200, message:'student login success', token:token,studentId:student._id, accountState:student.accountState, accountType:student.accountType}
    }catch(err){
        console.error(err)
        throw new Error('cant log')
    }
}

exports.studentForgotPassword = async(email) => {
    try{
        const isStudentValid = await Student.findOne({email});

        if(!isStudentValid){
            return({code:400,message:'not valid email'})
        }
        const otp = genarateOtp();

        console.log('otp',otp)

        const updateOtp = {}

        if(otp && email){
            updateOtp.otp = otp
        }

        await isStudentValid.updateOne(updateOtp)

        await sendOtpEmail(otp, email)

        return {code:200,message:`otp send to the ${email}`}

    }catch(err){
        console.error(err)
        throw new Error('forgot password fail')
    }
}

exports.studentCheckOtp = async(data) => {
    try{
        const {otp , email} = data;

        if(!otp || !email){
            return({code:401,message:'email and otp required'})
        }

        const student = await Student.findOne({email});

        if(!student){
            return({code:402,message:'email is not valid'})
        }

        if(student.otp !== otp){
            return({code:403,message:'otp not valid'})
        }

        return {code:200,message:'otp valid'}

    }catch(err){
        console.error(err)
        throw new Error('check otp fail')
    }
}

exports.studentUpdatePassword = async(studentId,data) => {
    try{

        const {newPassword, oldPassword} = data;

        const student = await Student.findById(studentId);
        

        if(!student){
            return {code:400,message:'student not valid'}
        }

        const isMatch = await bcrypt.compare(oldPassword,student.password);

        if(!isMatch){
            return {code:401,message:'new password and old password not match'};
        }

        const isPasswordValide = passwordValidate(newPassword) 

        if(isPasswordValide.valid === false){
            return {code:402,message:isPasswordValide.errors}
        }

        const updateData = {}

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);
        updateData.password = hashedPassword

        await student.updateOne(updateData)

        return {code:200, message:'password updated'}


    }catch(err){
        console.error(err)
        throw new Error('password cant update')
    }
}

exports.getByStudentId = async(id) => {
    try{
        const student = await Student.findById(id);



        return {code:200, data:student}
    }catch(err){
        console.error(err)
        throw new Error('cant get all student data')
    }
}

exports.getAllStudent = async() => {
    try{
        const student = await Student.find();

        if(!student){
            return {code:400,data:'not any data'}
        }

        const response = student.map(a => ({
            "name": a.name,
            "email": a.email,
            "studentId": a._id
        }));
        
        return {code: 200, data: response};

    }catch(err){
        console.error(err)
        throw new Error('cant get students')
    }
}

exports.deleteStudent = async(id) => {
    try{
 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { code: 400, message: 'Invalid admin ID' };
        }

        const student = await Student.findById(id);


        if(!student){
            return { code: 400, message: 'No student related to that ID' };
        }


        await student.deleteOne();

        return { code: 200, message: 'student deleted successfully' };
    } catch (err) {
        console.error(err);
        return { code: 500, message: 'Server error, unable to delete student' };
    }
}

exports.changeStudentState = async(id, state) => {
    try{
        const student = await Student.findById(id);

        if(!student){
            return{code:401, message:'there no student relate id'}
        }

        const updateData = {};
        if(state){
            updateData.accountState = state;
        }

        await Student.updateOne(updateData);

        return {code:200,message:'updated'}
    }catch(err){
        console.error(err);
        throw new Error('cant change state')
    }
}

exports.updateStudent = async(id, data) => {
    try{
        const {
            name,
            email,
            profileImg,
            whatsAppNo,
            additionalNo,
            district,
            scl,
            address,
            studentIdImg
        } = data

        const student = await Student.findById(id);
        

        if(!student){
            return {code:401, message:'incorrect id'}
        }

        const updateData = {};

        if(name){updateData.name = name};
        if(email){
            const student = await Student.findOne({email});
            const emailValidate = validator.isEmail(email);

            if(student){
                return{code:401, message:'email already registered'}
            }

            if(!emailValidate){
                return {code:401,message:'use valid email'}
            }
            updateData.email = email
        };
        if(profileImg){updateData.profileImg = profileImg};
        if(whatsAppNo){updateData.whatsAppNo = whatsAppNo};
        if(additionalNo){updateData.additionalNo = additionalNo};
        if(district){updateData.district = district};
        if(scl){updateData.scl = scl};
        if(address){updateData.address = address};
        if(studentIdImg){updateData.studentIdImg = studentIdImg};

        await student.updateOne(updateData);
        return {code:200,message:'updated'}
    }catch(err){
        console.error(err);
        throw new Error('cant update student')
    }
}