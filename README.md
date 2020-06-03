# Data work for Karen project

This repo contains the following:

- Node script to combine and clean [Social Security Administration](https://www.ssa.gov/oact/babynames/limits.html) national baby name data.
- R Markdown script to analyze the data and find names that had a similar trajectory of popularity over time as "Karen"

## Setup

#### Dependencies

- [node](https://nodejs.org/en/)
- [d3](https://d3js.org/)
- [fs](https://nodejs.org/api/fs.html)
- [lodash](https://lodash.com/)

#### Install

Clone the repo and run `npm i`

## Reproduce

### STEP 1: Node

#### In terminal run: `npm run combine-years`

Combines annual national level data files from `input/national/`. There is a separate .txt file for each year from 1880–2018. More details can be found in `documents/NationalReadMe.pdf`. Combines data in a single csv at `process/analysis/ssaData.csv`.

### STEP 2: R

#### Open and run `karenAnalysisCode.Rmd`

This file can be found in `process/analysis`. The script reads in the `ssaData.csv` file from the previous step, and measures the [Kendall rank correlation coefficient](https://towardsdatascience.com/kendall-rank-correlation-explained-dee01d99c535) between "Karen" and another name. Results are split by gender and output to `femaleKarenResults.csv` and `maleKarenResults.csv`.  
