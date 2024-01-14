const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { mapFileToStatements, validateCustomerStatements } = require('./helpers');

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('file'), handleFileUpload);

async function handleFileUpload(req, res) {
    try {
        const file = {
            type: req.file.mimetype,
            buffer: req.file.buffer
        }
        const statements = await mapFileToStatements(file)
        const validations = validateCustomerStatements(statements)
        res.json({validations})
    } catch (error) {
        console.error('Error processssing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

app.listen(8080, () => {
    console.log(`Server listening to port: ${8080}`);
});

// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//     awsServerlessExpress.proxy(server, event, context);
// };