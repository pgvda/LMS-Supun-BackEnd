const mongoose = require('mongoose');

const folderNameSchema = new mongoose.Schema({
    folderName: {
        type: String,
        required: true
    },
    folderId: {
        type: String,
        require:true
    }
    
});

const FolderName = mongoose.model('FolderName', folderNameSchema);

module.exports = FolderName;
