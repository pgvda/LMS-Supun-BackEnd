const FolderName = require('../model/DriveFolders');

exports.getFolderId = async(classType) => {
    try{
        const folder = await FolderName.findOne({folderName:classType});

        if(!folder) {
            return({code:400, message:'there are no folder'})
        }

        return folder.folderId;
    }catch(err){
        console.log(err)
    }
}