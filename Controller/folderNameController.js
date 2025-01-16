const folderNameService = require('../Services/folderNameServices');

exports.createFolderInDrive = async(req, res) => {
    try{
        const folderName = req.body.folderName;
        const {code, message} = await folderNameService.createFolderInDrive(folderName)
        res.status(200).json({code:code, message:message});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}