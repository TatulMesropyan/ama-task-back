const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { mapFileToStatements, validateCustomerStatements } = require('./helpers');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

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
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

app.listen(port, () => {
    console.log(`Server listening to port: ${port}`);
});
