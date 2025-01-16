const FolderName = require('../model/DriveFolders');
const { createFolder, authorize } = require('../utils/connectDrive');

exports.createFolderInDrive = async(folderName) => {
    try{
        const isNameAvailable = await FolderName.findOne({folderName});

        if(isNameAvailable){
            return({code:400, message:'folder name not available'});
        }
        const authClient = await authorize();

        const folderId = await createFolder(authClient, folderName)

        console.log(folderId);

        if(folderId === null){
            return({code:401, message:'folder not created'})
        }

        newFolder = new FolderName({
            folderName:folderName,
            folderId:folderId
        })

        await newFolder.save();
        return {code:200,message:'folder created'}
    }catch(err){
        console.log(err);
        throw new Error('cant create folder')
    }
}

exports.getAllFolderName = async() => {
    try{
        const folders = await FolderName.find();

        if(!folders){
            return({code:400, message:'no any folder available'});
        }

        const response = folders.map((data) => {
            return data.folderName;
        })

        return{code:200, message: 'success ', data:response}
    }catch(err){
        console.log(err);
        throw new Error('cant get folder names');
    }
}