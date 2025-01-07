const { google } = require('googleapis');


exports.grantAccess = async(authClient, fileId, studentEmail) => {
    const drive = google.drive({ version: 'v3', auth: authClient });
    try {
        const permission = {
          type: 'user',
          role: 'reader', 
          emailAddress: studentEmail,
        };
    
        await drive.permissions.create({
          fileId: fileId,
          resource: permission,
          fields: 'id',
        });
    
        console.log(`Access granted to ${studentEmail} for file ${fileId}`);
        return true;
      } catch (error) {
        console.error('Error granting access:', error.message);
        return false;
      }

}