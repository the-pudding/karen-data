# Data work for Karen project

This repo contains the following:

- Node scripts to combine and clean [Social Security Administration](https://www.ssa.gov/oact/babynames/limits.html) national baby name data. The `output` folder has been `gitignored` from this repo due to large data files.

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

## Notes
