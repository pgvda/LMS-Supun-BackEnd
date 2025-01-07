const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    regNo:{
        type:String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    profileImg: {
        type: String,
        default: null, 
    },
    accountType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    historyType:{
        type:String,
        require:true
    },
    accountState: {
        type: String,
        enum: ['active', 'de-active'],
        default: 'active',
    },
    batch: {
        type: String,
        required: true,
    },
    classType: {
        type: String,
        required: true,
    },
    whatsAppNo: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); 
            },
            message: (props) => `${props.value} is not a valid WhatsApp number!`,
        },
    },
    additionalNo: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v) || v === null; 
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    district: {
        type: String,
        required: true,
    },
    scl: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    studentIdImg: {
        type: String,
        required: false,
    },
    password: {
        type:String,
        required:true 
    },
    otp: {
        type:String
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
