const express = require('express');
const folderNameController = require('../Controller/folderNameController');
const authenticateToken = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminCheck');

const router = express.Router();

router.post('/create/folder', authenticateToken,folderNameController.createFolderInDrive);
router.get('/folder-names',folderNameController.getAllFolderName);
router.get('/diveFiles/:email',folderNameController.dirveFile);
router.get('/diveRootFiles/:email',folderNameController.getDirveRootFolders);
router.get('/folderContent/:id',folderNameController.folderContent);


module.exports = router;
