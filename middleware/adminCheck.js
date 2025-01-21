const Student = require('../model/Student');

const adminCheck = async(req, res, next) =>{
    try{
        const adminID = req.headers['admin_id'];

        if(!adminID){
            return res.status(400).json({msg:'Admin ID is required'})
        }

        const user = await Student.findById(adminID);
        if(!user || user.accountType !== 'admin'){
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = adminCheck;