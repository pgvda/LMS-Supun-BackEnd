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
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
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

module.exports = {
  authorize,
  listPermittedFolders,
  listPermittedFolderContent,
  createFolder
};
