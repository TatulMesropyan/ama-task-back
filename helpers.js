const {readCSV, readXML} = require('./fileReaders')

async function mapFileToStatements(file) {
    const {type, buffer} = file || {}
    let statements;
    switch (type) {
        case 'text/csv':
            statements = await readCSV(buffer)
            console.log(statements)
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


        const calculatedEndBalance = Number(record.startBalance) + Number(record.mutation);
        if (calculatedEndBalance !== record.endBalance) {
            failedRecords.push({ reference: record.reference, description: record.description, validation: "Failed mutation" });
        }
    });
    return failedRecords;
}

module.exports = { mapFileToStatements, validateCustomerStatements }