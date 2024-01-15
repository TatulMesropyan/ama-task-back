function validateFile(file) {
    if (!file || !file.mimetype || !file.buffer) {
        throw new Error('Invalid file');
    }
    if (file.type !== 'text/csv' && file.type !== 'text/xml') {
        throw new Error('Invalid file type');
    }
}

module.exports = { validateFile };