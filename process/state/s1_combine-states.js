const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');

const IN_PATH = './input/state/'
const OUT_PATH = './output/state/'

const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.TXT'));
let combinedFiles = [];

//TO-DO: add rank
function processCSV(filename) {
    const FILE_PATH = `./input/state/${filename}`
    let raw = fs.readFileSync(FILE_PATH, 'utf-8')
    let data = d3.csvParseRows(raw, function(d,i) {
        return {
            state: d[0],
            year: d[2],
            name: d[3],
            gender: d[1],
            count: +d[4]
        }
    })  
    combinedFiles.push(data)
}

function init() {
    _.each(files, filename => processCSV(filename))

    const flat = [].concat(...combinedFiles).map(d => ({ ...d, }));
    const csv = d3.csvFormat(flat)

    fs.writeFileSync(`${OUT_PATH}/combinedFiles.csv`, csv)
}

init();