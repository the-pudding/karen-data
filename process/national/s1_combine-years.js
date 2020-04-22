const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');
const ranked = require('ranked');


const IN_PATH = './input/national/'
const OUT_PATH = './output/national/'

const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.txt'));
let nestedData = [];
let combinedFiles = [];
let rankedData = [];

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

function addRank(data) {
    nestedData = d3
        .nest()
        .key(d => d.year)
        .key(d => d.gender)
        .rollup(values => {
            const rankedItems = ranked.ranking(values, v => +v.count)

            //console.log(rankedItems)

            return rankedItems.map(d => ({
                ...d.item,
                rank: d.item.count ? d.rank : null
            }));
        })
        .entries(data)
}

function flattenRankData(data) {
    data.map(function(d) {
        d.values.map(function(s) {
            tData  = s.value.map(function(t) {
                return {
                    year: t.year,
                    gender: t.gender,
                    name: t.name,
                    count: t.count,
                    rank: t.rank
                }
            })
            rankedData = rankedData.concat(tData)
        })
    })
}

function init() {
    // Turn each file into a single CSV
    _.each(files, filename => processCSV(filename))

    // Flatten the combined data
    const flat = [].concat(...combinedFiles).map(d => ({ ...d }));

    // Add a rank to the data
    addRank(flat)

    // Flatten the ranked data
    flattenRankData(nestedData)

    // Format a CSV to save
    const csv = d3.csvFormat(rankedData)

    // Output the file
    fs.writeFileSync(`${OUT_PATH}/combinedFiles.csv`, csv)
}

init();