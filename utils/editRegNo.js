const Student = require('../model/Student');

exports.editRegNo = async({ batch, classType, historyType }) => {
    try {
        if (!batch || typeof batch !== 'string') {
            throw new Error('Invalid batch parameter');
        }

        const studentCount = await Student.countDocuments();
        const batchNo = batch.toString().slice(-2);
        const selectedClassType = await classTypeHandle(classType);
        const selectedHistoryType = await historyTypeHandle(historyType);
        const realStudentCount = await handleStudentCount(studentCount);

        const regNo = `${batchNo} ${selectedClassType} ${realStudentCount} L${selectedHistoryType}`;
        return regNo;
    } catch (err) {
        console.log(err);
    }
}


const classTypeHandle = (classType) => {
    if(classType === 'Theory'){
        return 'T'
    }
    if(classType === 'Revision'){
        return 'R'
    }
    if(classType === 'Theory&Revision'){
        return 'TR'
    }
    if(classType === 'Paper'){
        return 'P'
    }
}

const historyTypeHandle = (historyType) => {
    if(historyType === 'Indian'){
        return 'I'
    }
    if(historyType === 'Europe'){
        return 'E'
    }
   
}

const handleStudentCount = (count) => {
    const newCount = count + 1;

    if(newCount<10){
        return `0${newCount}`
    }else{
        return newCount
    }
}

