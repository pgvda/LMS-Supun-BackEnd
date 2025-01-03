const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/config');
const { authorize, listFiles } = require('./utils/connectDrive');

const app = express();

const corsOption = {
    origin:'*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(bodyParser.json());
app.use(cors(corsOption));

mongoose.connect(config.mongoDbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const studentRouters = require('./Routers/studentRoutes');

app.use('/api/students', studentRouters);

app.get('/files', async (req, res) => {
    try {
      const authClient = await authorize();
      const files = await listFiles(authClient);
      res.json(files); // Send the list of files as a response
    } catch (error) {
      console.error('Error fetching files:', error.message);
      res.status(500).send('Failed to fetch files');
    }
  });
  
const PORT = config.port || 4001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});