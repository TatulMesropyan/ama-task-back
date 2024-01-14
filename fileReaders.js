const csv = require('csv-parser');
const xml2js = require('xml2js');

function readCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
        const statements = [];
        const stream = csv({ headers: true, skipLines: 1 })
            .on('data', (row) => {
                
                const newRow = {
                    reference: row['_0'],
                    accountNumber: row['_1'],
                    description: row['_2'],
                    startBalance: row['_3'],
                    mutation: row['_4'],
                    endBalance: row['_5']
                }
                statements.push(newRow)
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
        const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
        parser.parseString(xmlString, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const statements = result.records.record
                resolve(statements);
            }
        });
    });
}

module.exports = { readCSV, readXML };