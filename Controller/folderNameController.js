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

exports.getAllFolderName = async(req, res) => {
    try{
        const {code,message, data} = await folderNameService.getAllFolderName();
        res.status(200).json({code:code,message:message, data});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    }
}

exports.dirveFile = async(req, res) => {
    try{
        const email = req.params.email
        const {code,files} = await folderNameService.dirveFile(email);
        res.status(200).json({code:code,files:files});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    } 
}

exports.folderContent = async(req, res) => {
    try{
        const folderId = req.params.email
        const {code,message, files} = await folderNameService.folderContent(folderId);
        res.status(200).json({code:code,message:files, files});
    }catch(err){
        res.status(500).json ({status:500, message:err.message})
    } 
}