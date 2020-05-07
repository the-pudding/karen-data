const fs = require('fs');
const d3 = require('d3');


const IN_PATH = './output/national/'
const OUT_PATH = './output/national/'

// const namesNest = d3.nest().key(d => d.name).entries(genderData)

// const rankFilter = namesNest.filter(d => {
//     const minRank = d3.min(d.values, v => +v.rank)

//     return minRank < 5
// })


function init() {
    // load data
    console.log("loading data")
    const data = d3.csvParse(fs.readFileSync(`${IN_PATH}combinedFiles.csv`, 'utf-8'))

    // filter by gender
    console.log("filtering by gender")
    const genderData = data.filter(d => d.gender === 'F')

    //nest by name
    console.log("nesting by name")
    const namesNest = d3.nest().key(d => d.name).entries(genderData)

    // filter by rank
    console.log("filtering by rank")
    const rankFilter = namesNest.filter(d => {
        const minRank = d3.min(d.values, v => +v.rank)
        return minRank < 5
    })

    // filter data by name
    console.log("filtering by name")
    const karenData = genderData.filter(d => d.name === 'Karen')

    // format files to save
    console.log("creating files")
    const csv = d3.csvFormat(karenData)
    const jsonFile = JSON.stringify(rankFilter)

    // output the files
    console.log("saving")
    fs.writeFileSync(`${OUT_PATH}karenData.csv`, csv)
    fs.writeFileSync(`${OUT_PATH}nestedData.json`, jsonFile)
}

init();