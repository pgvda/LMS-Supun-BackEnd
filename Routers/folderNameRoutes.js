const express = require('express');
const folderNameController = require('../Controller/folderNameController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create/folder',folderNameController.createFolderInDrive);
router.get('/folder-names',folderNameController.getAllFolderName);


module.exports = router;