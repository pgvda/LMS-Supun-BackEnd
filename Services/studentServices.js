const Student = require('../model/Student');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/genarateToken');
const genarateOtp = require('../utils/genarateOtp');
const sendOtpEmail = require('../utils/mailer');
const passwordValidate = require('../middleware/passwordValidator');

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
            password
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        return{code:200, message:'student login success', token:token,studentId:student._id}
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