const express = require('express')
const main = express.Router()
// const words = require('an-array-of-english-words') // l = 274,918
const fs = require('fs')
const words = fs.readFileSync('server/words.txt', 'utf-8').split('\n')
const ignoreWords = fs.readFileSync('server/ignore.txt', 'utf-8').split('\n')

const rangeOfX = 5241
const rangeOfY = 3894
const numberOfSquares = rangeOfX * rangeOfY

const numberOfWords = words.length

var mapArray = []
for(let i = 0; i < rangeOfY; i++) {
    mapArray.push([])
    for(let j = 0; j < rangeOfX; j++) {
        mapArray[i].push('')
    }
}

fillWithSpiralIndexes()
console.log('ready')

main.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

main.post('/str-coords', (req, res) => {

    let reqStringArr = req.body.phrase.split(' ')

    let sum = 1
    for(let i = 0; i < reqStringArr.length; i++) {
        if(words.indexOf(reqStringArr[i]) != -1) {
            sum *= words.indexOf(reqStringArr[i])
        }
        else if(ignoreWords.indexOf(reqStringArr[i]) != -1) {

        }
        else {
            res.status(200).json({ 'error': 1 })
        }
        
    }
    
    let key = sum
    let indexSpiral = key % numberOfSquares // index in the spiral

    let realIndex = getRealIndex(indexSpiral) // find index (i, j) of indexspiral from the mapArray

    let x = (parseInt(realIndex.realX) + 5353) / 1000 * -1 // add longitude constraints
    let y = (parseInt(realIndex.realY) + 51478) / 1000 // add latitude constaints

    res.status(200).json({
        'error': 0,
        'core': {
            'phrase': req.body.phrase,
            'longitude': x,
            'latitude': y,
            'escape': escape(req.body.phrase)
        }
    })

})

main.post('/coords-str', (req, res) => {

    let longitude = req.body.longitude // request long
    let latitude = req.body.latitude // request lat

    let realX = Math.round(longitude * -1 * 1000) - 5353 // remove x constraints
    let realY = Math.round(latitude * 1000) - 51478 // remove y constraints

    let indexSpiral = mapArray[realY][realX]

    let key, wordIndexes, index = 0
    let error = true
    while(error == true) {

        index++

        key = genKey(indexSpiral) // generate key
        wordIndexes = generateWordIndexesMult(key) // generate word indexes from key
        error = wordIndexes.error // set error to error status
        if(index >= 100) {
            index = 0
            indexSpiral++
        }

    }

    let strArr = [ words[wordIndexes.a], words[wordIndexes.b] ] // fill array of the indexes

    res.status(200).json({ 
        'error': 0,
        'core': {
            'phrase': strArr.toString().replace(',', ' '),
            'longitude': longitude.toFixed(3),
            'latitude': latitude.toFixed(2),
            'escape': escape(strArr.toString().replace(',', ' '))
        }
    })


    // let key = genKey(indexSpiral)
    // console.log('key generated: ' + key)

    // let sum = key
    // wordIndexes = generateWordIndexesMult(sum)
    // console.log(wordIndexes)
    
    // let strArr = []
    // if(wordIndexes.error == 0) {
        
    //     strArr.push(words[wordIndexes.a])
    //     strArr.push(words[wordIndexes.b])
    //     console.log('string array: ' + strArr.toString())
    //     res.status(200).json({ 'res': strArr.toString() })
    // }
    // else {
    //     console.log('failed')
    //     res.status(200).json({ 'res': 'failed' })
    // }

})

function getRealIndex(index) {

    for(let i = 0; i < mapArray.length; i++) { // go through the matrix, find the where the spiral index is located, and note i and j
        for(let j = 0; j < mapArray[i].length; j++) {
            if(mapArray[i][j] == index) {
                return { 'realX': j, 'realY': i, 'error': 0 }
            }
        }
    }

    return { 'error': 1 }

}

function fillWithSpiralIndexes() {

    let index = numberOfSquares -1
 
    let rowStart = 0
    let rowLength = mapArray.length-1
     
    let colStart = 0
    let colLength = mapArray[0].length-1
     
    while(rowStart <= rowLength && colStart <= colLength) {
     
        for(let i = rowStart; i <= colLength; i++) {
            mapArray[rowStart][i] = index
            index--
        }

        for(let j = rowStart + 1; j <= rowLength; j++) {
            mapArray[j][colLength] = index
            index--
        }

        if(rowStart + 1 <= rowLength) {
            for(let k = colLength - 1; k >= colStart; k--) {
                mapArray[rowLength][k] = index
                index--
            }
        }
        if(colStart + 1 <= colLength) {
            for(let k = rowLength-1; k > rowStart; k--) {
                mapArray[k][colStart] = index
                index--
            }
        }

        rowStart++
        rowLength--
        colStart++
        colLength--

    }
}

function generateWordIndexesMult(sum) {

    let index = 0
    while(index < 1000000) {
        let i = Math.floor(Math.random()*(numberOfWords-1+1)+1)
        if(sum % i == 0 && i <= numberOfWords && sum/i <= numberOfWords)
            return { 'a': i, 'b': sum/i, 'error': false }
        index++
    }

    return { 'error': true }

}

function genKey(val) {

    let min = 2, max = Math.pow(numberOfWords, 2)

    while(true) {
        r = Math.floor(Math.random()*(max-min+1)+min)

        if(r % numberOfSquares == val) {
            return r
        }
    }
    
}

module.exports = main;





















// function generateWordIndexes(sum) {

//     let loopDone = false
//     let firstGen, secondGen, thirdGen, fourthGen
//     while(loopDone == false) {

//         firstGen = Math.floor(Math.random()*(numberOfWords-0+1)+0)
//         secondGen = Math.floor(Math.random()*(numberOfWords-0+1)+0)
//         thirdGen = Math.floor(Math.random()*(numberOfWords-0+1)+0)

//         if((firstGen + secondGen + thirdGen) <= sum && sum - (firstGen + secondGen + thirdGen) <= numberOfWords) {
//             loopDone = true
//         }
//     }

//     fourthGen = sum - (firstGen + secondGen + thirdGen)

//     return [firstGen, secondGen, thirdGen, fourthGen]

// }