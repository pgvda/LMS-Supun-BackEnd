const fs = require('fs').promises;
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// Scopes and file paths
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata'
];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credential.json');

// Load previously authorized credentials
async function loadSavedCredentialsIfExist() {
  try {
    console.log('6');
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.error('Error loading saved credentials:', err.message);
    return null;
  }
}

// Save credentials
async function saveCredentials(client) {
  try {
    console.log('7');
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
    console.log('Credentials saved successfully.');
  } catch (err) {
    console.error('Error saving credentials:', err.message);
  }
}

// Authorize and return an authenticated client
async function authorize() {
  console.log('3');
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  console.log('5');
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// List folders shared with a specific email
async function listPermittedFolders(authClient, email) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {
    const res = await drive.files.list({
      q: `'${email}' in readers and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
      pageSize: 10, // Adjust as needed
    });

    const folders = res.data.files;
    if (!folders || folders.length === 0) {
      console.log(`No folders shared with ${email}`);
      return [];
    }

    console.log(`Folders shared with ${email}:`);
    folders.forEach((folder) => {
      console.log(`${folder.name} (${folder.id})`);
    });

    return folders;
  } catch (err) {
    console.error('Error listing folders:', err.message);
    return [];
  }
}

// List folders shared with a specific folderId
async function listPermittedFolderContent(authClient, folderId) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
      
    });

    const folders = res.data.files;
    if (!folders || folders.length === 0) {
      console.log(`No folders shared with ${folderId}`);
      return [];
    }

    console.log(`Folders shared with ${folderId}:`);
    folders.forEach((folder) => {
      console.log(`${folder.name} (${folder.id})`);
    });

    return folders;
  } catch (err) {
    console.error('Error listing folders:', err.message);
    return [];
  }
}

async function createFolder(authClient, folderName) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });
  return res.data.id;
}

async function revokeAllPermissions(authClient, emailToRemove) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {
    // 1. Get all folders shared with the email
    const folders = await listPermittedFolders(authClient, emailToRemove);

    if (!folders || folders.length === 0) {
      console.log(`No folders shared with ${emailToRemove}. Nothing to revoke.`);
      return;
    }

    console.log(`Revoking access to ${folders.length} folders for ${emailToRemove}...`);

    // 2. For each folder, revoke the permission
    for (const folder of folders) {
      try {
        const res = await drive.permissions.list({
          fileId: folder.id,
          fields: 'permissions(id, emailAddress, role)',
        });

        const permissions = res.data.permissions;
        if (!permissions || permissions.length === 0) {
          console.log(`No permissions found on folder ${folder.name} (${folder.id}).`);
          continue;
        }

        // Find permission by email
        const permission = permissions.find(p => p.emailAddress === emailToRemove);

        if (permission) {
          await drive.permissions.delete({
            fileId: folder.id,
            permissionId: permission.id,
          });
          console.log(`✅ Revoked access from folder: ${folder.name} (${folder.id})`);
        } else {
          console.log(`No permission found for ${emailToRemove} on folder ${folder.name} (${folder.id}).`);
        }
      } catch (innerErr) {
        console.error(`❌ Error revoking permission on folder ${folder.name} (${folder.id}):`, innerErr.message);
      }
    }

    console.log(`✅ All permissions for ${emailToRemove} have been revoked.`);
  } catch (err) {
    console.error('❌ Error revoking all permissions:', err.message);
  }
}

module.exports = {
  authorize,
  listPermittedFolders,
  listPermittedFolderContent,
  createFolder,
  revokeAllPermissions,
};
