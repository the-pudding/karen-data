const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');
//const ranked = require('ranked');


const IN_PATH = './input/national/'
const OUT_PATH = './output/national/'

const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.txt'));
let outputData = [];
const startYear = 1918
const years = d3.range(startYear, 2019)

function processCSV(filename) {
    console.log(`reading file: ${filename}`)
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
    return data
}

function filterData(data) {
    // filter out previous years' data
    const filteredData = data.filter(d => (d.year >= startYear))

    // filter out male names
    //const femaleData = filteredData.filter(d => (d.gender == 'F'))

    // save to global variable
    outputData = filteredData
}

function init() {
    // turn each file into a single CSV
    const rawData = _.flatten(
        _.map(files, filename => processCSV(filename))
    )
    
    // filter data
    filterData(rawData)

    // create an id for each data point
    const dataByYearId = {}
    outputData.forEach(d => {
        const id = [d.name, d.gender].join("--")
        const idWithYear = [id, d.year].join("--")
        dataByYearId[idWithYear] = {...d, id, idWithYear}
    })

    // create an array of unique ids
    const ids = _.uniq(_.values(dataByYearId).map(d => d.id))

    // for each year, create an array of count for each unique id
    const dataByYear = years.map(year => {
        console.log(`processing ${year}...`)
        const values = ids.map((id, i) => {
            const idWithYear = [id, year].join("--")
            let matchingData = dataByYearId[idWithYear]
            if (!matchingData) {
                const [name, gender] = id.split("--")
                matchingData = {
                    id,
                    name,
                    gender,
                    year,
                    count: null,
                }
            }
            delete matchingData["idWithYear"]
            delete matchingData["id"]
            return matchingData
        })
        let runningCount = {
            F: null,
            M: null,
        }
        let runningRank = {
            F: 0,
            M: 0,
        }
        const rankedValues = _.orderBy(values, "count", "desc").map((d, i) => {
            if (runningCount[d.gender] != d.count) {
                runningRank[d.gender] += 1
            }
            runningCount[d.gender] = d.count
            return {
                ...d,
                rank: runningRank[d.gender],
            }
        })
        return rankedValues
    })

    // unpack each year to sit in one array
    console.log("flattening years")
    const flattenedDataByYear = _.flatten(dataByYear)

    // format a CSV to save
    console.log("creating csv")
    const csv = d3.csvFormat(flattenedDataByYear)

    // output the file
    console.log("saving")
    fs.writeFileSync(`${OUT_PATH}combinedFiles.csv`, csv)
}

init();