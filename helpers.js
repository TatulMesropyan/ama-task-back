const csv = require('csv-parser');
const xml2js = require('xml2js');

function readCSV(fileBuffer) {
    const statements = new Set();
    return new Promise((resolve, reject) => {
        const stream = csv({ headers: true, skipLines: 1 })
            .on('data', (row) => {
                const newRow = {
                    reference: Number(row['_0']),
                    accountNumber: row['_1'],
                    description: row['_2'],
                    startBalance: Number(row['_3']),
                    mutation: Number(row['_4']),
                    endBalance: Number(row['_5'])
                }
                statements.add(newRow)
            })
            .on('end', () => resolve(statements))
            .on('error', (error) => reject(error))
        stream.write(fileBuffer)
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
async function mapTypeToDocHandler(type, fileBuffer) {
    let statements;
    switch (type) {
        case 'text/csv':
        case 'csv':
            statements = await readCSV(fileBuffer);
            break;
        case 'text/xml':
        case 'xml':
            statements = await readXML(fileBuffer);
            break;
    }
    return statements;
}
function validateCustomerStatements(statements) {
    const uniqueTransactionReferences = new Set();
    const failedRecords = [];

    statements.forEach(record => {
        if (uniqueTransactionReferences.has(record.reference)) {
            failedRecords.push({ reference: record.Reference, reference: record.Description });
        } else {
            uniqueTransactionReferences.add(record.reference);
        }

        const calculatedEndBalance = record.startBalance + record.mutation;
        if (calculatedEndBalance !== record.EndBalance) {
            failedRecords.push({ reference: record.reference, description: record.description });
        }
    });

    return failedRecords;
}
// function getConvertedTypes(statements) {
//     statements?.map((row, index) => {
//         const key = `_${index}`
//         return {
//             reference: row[key],
//             accountNumber: row[key],
//             description: row[key],
//             startBalance: row[key],
//             mutation: row[key],
//             endBalance: row[key]
//         }
//     })
// }
module.exports = { mapTypeToDocHandler }