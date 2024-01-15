const {readCSV, readXML} = require('./fileReaders')

async function mapFileToStatements(file) {
    const {type, buffer} = file || {}
    let statements;
    switch (type) {
        case 'text/csv':
            statements = await readCSV(buffer)
            break;
        case 'text/xml':
            statements = await readXML(buffer);
            break;
    }
    return statements;
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

module.exports = { mapFileToStatements, validateCustomerStatements }