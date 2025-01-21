const atob = require('atob');
const express = require('express');

const router = express.Router();

router.get('/secure-file', (req, res) => {
    try {
      const encodedId = req.query.id;
  
      if (!encodedId) {
        return res.status(400).json({ msg: 'File ID is required' });
      }
  
      const fileId = atob(encodedId); 
      const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
  
      res.redirect(driveUrl); 
    } catch (error) {
      console.error('Error decoding file ID:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  module.exports = router;