# Combining SSA baby name data files

Node scripts to combine and clean [Social Security Administration](https://www.ssa.gov/oact/babynames/limits.html) national and state-level baby name data. Currently a WIP for an upcoming story on [The Pudding](https://pudding.cool/). The `outuput` folder has been `gitignored` from this repo due to large data files.

## Setup

#### Dependencies

- [node](https://nodejs.org/en/)
- [d3](https://d3js.org/)
- [fs](https://nodejs.org/api/fs.html)
- [lodash](https://lodash.com/)

#### Install

Clone the repo and run `npm i`

## Reproduce

### National

#### `npm run combine-years`

Combines annual national level data files from `input/national/`. There is a separate .txt file for each year from 1880–2018. More details can be found in `documents/NationalReadMe.pdf`. Combines data in a single csv at `input/national/combinedFiles.csv`.

### State

#### `npm run combine-states`

Combines annual national level data files from `input/state/`. There is a separate .txt file for each state from 1910–2018. More details can be found in `documents/StateReadMe.pdf`. Combines data in a single csv at `input/state/combinedFiles.csv`.

TO-DO: Add rank, fill in missing years and set parameters to limit data.

## Notes
