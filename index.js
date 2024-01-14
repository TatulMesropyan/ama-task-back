const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { mapTypeToDocHandler } = require('./helpers');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('file'), handleFileUpload);

function handleFileUpload(req, res) {
    try {
        const fileBuffer = req.file.buffer;
        const fileType = req.file.mimetype
        const statements = mapTypeToDocHandler(fileType, fileBuffer)
        console.log(statements)
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

app.listen(port, () => {
    console.log(`Server listening to port: ${port}`);
});
