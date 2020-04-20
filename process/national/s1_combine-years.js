const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');

const IN_PATH = './input/national/'
const OUT_PATH = './output/national/'

const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.txt'));
let combinedFiles = [];

//TO-DO: add rank
function processCSV(filename) {
    const FILE_PATH = `./input/national/${filename}`
    let year = filename.split('.')[0]
    year = year.split('b')[1]
    let raw = fs.readFileSync(FILE_PATH, 'utf-8')
    let data = d3.csvParseRows(raw, function(d,i) {
        return {
            year: +year,
            name: d[0],
            gender: d[1],
            count: +d[2]
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