const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload/:type', upload.single('file'), handleFileUpload);

function handleFileUpload(req, res) {
    try {
        const fileBuffer = req.file.buffer;
        const fileType = req.file.mimetype
        let statements;
        console.log(fileBuffer)
        console.log(fileType)
        if (fileType === 'text/csv') {
            statements = readCSV(fileBuffer);
        } else if (fileType === 'text/xml') {
            statements = readXML(fileBuffer);
        } else {
            return res.status(400).json({ error: 'Invalid file type. Supported types: csv, xml' });
        }

        // validateAndRespond(statements, res);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function readCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
        const statements = [];

        const stream = csv({ headers: true })
            .on('data', (row) => statements.push(row))
            .on('end', () => resolve(statements))
            .on('error', (error) => reject(error))
            stream.write(fileBuffer);
            stream.end();
    });
}

function readXML(fileBuffer) {
    return new Promise((resolve, reject) => {
        const xmlString = fileBuffer.toString('utf-8');

        xml2js.parseString(xmlString, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.records.record);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server listening to port: ${port}`);
});
