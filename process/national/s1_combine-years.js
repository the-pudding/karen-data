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
let filledData = [];
let completeData = [];
let completeFilteredData = [];

function processCSV(filename) {
    console.log('processCSV')
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
    console.log('addRank')
    nestedData = d3
        .nest()
        .key(d => d.year)
        .key(d => d.gender)
        .rollup(values => {
            const rankedItems = ranked.ranking(values, v => +v.count)

            return rankedItems.map(d => ({
                ...d.item,
                rank: d.item.count ? d.rank : null
            }));
        })
        .entries(data)
}

function flattenRankData(data) {
    console.log('flattenRankData')
    data.map(function(d) {
        d.values.map(function(s) {
            let tData  = s.value.map(function(t) {
                return {
                    year: t.year,
                    gender: t.gender,
                    name: t.name,
                    count: t.count,
                    rank: t.rank,
                    nameGen: `${t.name}-${t.gender}`
                }
            })
            rankedData = rankedData.concat(tData)
        })
    })
    // Add empty annual data for each name even if it didn't appear that year
    padOutYears(rankedData)
}

function padOutYears(data, i) {
    console.log('padOutYears')
    const nameGenderKeyData = d3
        .nest()
        .key(d => d.nameGen)
        .entries(data)
    
    const years = d3.range(1880, 2019)

    filledData = nameGenderKeyData.map((d, i) => {
        const progress = `${(i/nameGenderKeyData.length)*100}%`
        console.log('filledData', progress)
        const withFiller = years.map(year => {
            const match = d.values.find(v => v.year === year);
            if (match) return match;
            return { year, count: 0, rank: 0 };
        });
        return {
            key: d.key,
            values: withFiller
        }
    });

    filledData = filledData.map(function(d, i) {
        const progress = `${(i/filledData.length)*100}%`
        console.log('filledData2', progress)
        let tData  = d.values.map(function(t) {
            return {
                year: t.year,
                gender: t.gender,
                name: t.name,
                count: t.count,
                rank: t.rank,
                nameGen: `${t.name}-${t.gender}`
            }
        })
        completeData = completeData.concat(tData)
        //console.log(completeData)
    })
}

function filterData(data) {
    console.log('filterData')
    completeFilteredData  = data.filter(d => d.year > 1949)
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

    // Filter the data before saving
    filterData(completeData)

    // Format a CSV to save
    const csv = d3.csvFormat(completeFilteredData)

    // Output the file
    fs.writeFileSync(`${OUT_PATH}/combinedFiles.csv`, csv)
}

init();