const express = require('express');
const multer = require('multer');
const cors = require('cors');
const awsServerlessExpress = require('aws-serverless-express');
const { mapFileToStatements, validateCustomerStatements } = require('./helpers');

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('file'), handleFileUpload);

async function handleFileUpload(req, res) {
    try {
        validateFile(req.file);
        const file = {
            type: req.file.mimetype,
            buffer: req.file.buffer
        }
        const statements = await mapFileToStatements(file)
        const validations = validateCustomerStatements(statements)
        return res.json({ validations })
    } catch (error) {
        console.error('Error processssing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};