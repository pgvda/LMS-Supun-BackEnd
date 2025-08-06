const FolderName = require('../model/DriveFolders');
const { createFolder, authorize, listPermittedFolders,listPermittedFolderContent,listPermittedMainFolders } = require('../utils/connectDrive');
const fs = require('fs');
const path = require('path');


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

exports.dirveFile = async(email) => {
    try {
        console.log('1');
        const authClient = await authorize();
        console.log('2');
        
        console.log(email);
        const files = await listPermittedFolders(authClient, email);
        return {code:200, files:files}
      } catch (error) {
        console.error('Error fetching files:', error.message);
       throw new Error('Failed to fetch files');
      }
}

exports.folderContent = async(folderId)=> {
    try {
        const authClient = await authorize();
        
        
        const files = await listPermittedFolderContent(authClient, folderId);
        console.log(files)
        return {code:200, files:files} // Send the list of files as a response
      } catch (error) {
        console.error('Error fetching files:', error.message);
        throw new Error('Failed to fetch files', error.message);
      }
}

exports.deleteTokenFile = async()=> {
    try {
        const tokenFilePath = path.join(process.cwd(), 'token.json');
        
        fs.unlink(tokenFilePath, (err) => {
            if(err){
                if(err.code === 'ENOENT') {
                    return {code:400, message:'token.json not found'}
                }
                return {code:500, message:err.message}
            }
            return {code:200, message: 'delete successful'} 
        })
        
      } catch (error) {
        console.error('Error fetching files:', error.message);
        throw new Error('conot delete', error.message);
      }
}

exports.getDriveRootFolders = async(email) => {
    try {
        console.log('1');
        const authClient = await authorize();
        console.log('2');
        
        console.log(email);
        const files = await listPermittedMainFolders(authClient, email);
        return {code:200, files:files}
      } catch (error) {
        console.error('Error fetching files:', error.message);
       throw new Error('Failed to fetch files');
      }
}
