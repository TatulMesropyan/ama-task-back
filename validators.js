function validateFile(file) {
    if (!file || !file.mimetype || !file.buffer) {
        throw new Error('invalidFile');
    }
    if (file.mimetype !== 'text/csv' && file.mimetype !== 'text/xml') {
        throw new Error('unsupportedFileType');
    }
}

module.exports = { validateFile };
