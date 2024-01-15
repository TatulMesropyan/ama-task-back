const { readCSV, readXML } = require('./fileReaders')

async function readFile(type, buffer) {
    switch (type) {
        case 'text/csv':
            return await readCSV(buffer);
        case 'text/xml':
            return await readXML(buffer);
        default:
            throw new Error('Unsupported file type');
    }
}

async function mapFileToStatements(file) {
    const { type, buffer } = file || {};
    return await readFile(type, buffer);
}

function validateCustomerStatements(statements) {
    const uniqueTransactions = new Set();
    const failedRecords = [];

    statements.forEach(record => {
        if (uniqueTransactions.has(record.reference)) {
            failedRecords.push({ reference: record.reference, description: record.description, validation: "Failed uniqueness" });
        } else {
            uniqueTransactions.add(record.reference);
        }

        const calculatedEndBalance = parseFloat(record.startBalance) + parseFloat(record.mutation)
        const actualEndBalance = parseFloat(record.endBalance).toFixed(2);
        if (parseFloat(calculatedEndBalance.toFixed(2)) !== parseFloat(actualEndBalance)) {
            failedRecords.push({ reference: record.reference, description: record.description, validation: "Failed mutation" });
        }
    });

    return failedRecords;
}

module.exports = { mapFileToStatements, validateCustomerStatements };