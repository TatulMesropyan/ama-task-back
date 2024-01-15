const express = require('express');
const multer = require('multer');
const cors = require('cors');
const awsServerlessExpress = require('aws-serverless-express');
const { mapFileToStatements, mapErrorToStatusAndMessage, validateCustomerStatements } = require('./helpers');
const { validateFile } = require('./validators');

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
        const {message, status} = mapErrorToStatusAndMessage(error.message) || {}
        res.status(status).json({ errorMessage: message });
    }
}

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};