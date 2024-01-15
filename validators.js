async function validateFile(file) {
    if (!file || !file.mimetype || !file.buffer) {
        throw new Error('Invalid file');
    }
    if (file.mimetype !== 'text/csv' && file.mimetype !== 'text/xml') {
        throw new Error('Invalid file type');
    }
}

module.exports = { validateFile };