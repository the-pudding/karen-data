const fs = require('fs');
const d3 = require('d3');
const _ = require('lodash');
const ranked = require('ranked');


const IN_PATH = './input/national/'
const OUT_PATH = './output/national/'

const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.txt'));

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
    // combinedFiles.push(data)
    return data
}

function init() {
    // Turn each file into a single CSV
    const rawData = _.flatten(
        _.map(files, filename => processCSV(filename))
    )

    // filter out previous years' data
    const startYear = 1949
    const years = d3.range(startYear, 2019)
    const filteredData = rawData.filter(d => (
        d.year >= startYear
    ))

    // create an id for each data point
    const dataByYearId = {}
    filteredData.forEach(d => {
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
                    count: 0,
                }
            }
            // if (!(i % 100)) {
            //     console.log(`processing names per year, ${((i * 100 / ids.length) + "").slice(0, 5)}%`)
            // }
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

    // Format a CSV to save
    console.log("creating csv")
    const csv = d3.csvFormat(flattenedDataByYear)

    // Output the file
    console.log("saving")
    fs.writeFileSync(`${OUT_PATH}combinedFiles.csv`, csv)
}

init();