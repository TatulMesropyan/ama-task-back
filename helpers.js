const { readCSV, readXML } = require('./fileReaders');

async function readFile(type, buffer) {
    switch (type) {
        case 'text/csv':
            return await readCSV(buffer);
        case 'text/xml':
            return await readXML(buffer);
        default:
            throw new Error('unsupportedFileType');
    }
}

async function mapFileToStatements(file) {
    const { type, buffer } = file || {};
    return await readFile(type, buffer);
}

function validateCustomerStatements(statements) {
    const uniqueTransactions = new Set();
    const failedRecords = [];

    statements.forEach((record) => {
        const calculatedEndBalance = parseFloat(record.startBalance) + parseFloat(record.mutation);
        const actualEndBalance = parseFloat(record.endBalance).toFixed(2);
        if (uniqueTransactions.has(record.reference)) {
            failedRecords.push({
                reference: record.reference,
                description: record.description,
                calculatedEndBalance: parseFloat(calculatedEndBalance.toFixed(2)),
                actualEndBalance: parseFloat(actualEndBalance),
                validation: 'Failed uniqueness',
            });
        } else {
            uniqueTransactions.add(record.reference);
        }
        if (parseFloat(calculatedEndBalance.toFixed(2)) !== parseFloat(actualEndBalance)) {
            failedRecords.push({
                reference: record.reference,
                description: record.description,
                calculatedEndBalance: parseFloat(calculatedEndBalance.toFixed(2)),
                actualEndBalance: parseFloat(actualEndBalance),
                validation: 'Failed mutation',
            });
        }
    });

    return failedRecords;
}

function mapErrorToStatusAndMessage(err) {
    switch (err) {
        case 'invalidFile':
            return {
                message: "Invalid file",
                status: 400
            };
        case 'unsupportedFileType':
            return {
                message: "Unsupported file type",
                status: 415
            };
        case 'invalidXML':
            return {
                message: "Invalid XML format",
                status: 400
            };
        case 'invalidCSV':
            return {
                message: "Invalid CSV format",
                status: 400
            };
        default:
            return {
                message: "Internal server error",
                status: 500
            };
    }
}

module.exports = { mapFileToStatements, validateCustomerStatements, mapErrorToStatusAndMessage };
