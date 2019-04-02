const fs = require('fs');
const words = fs.readFileSync('server/words_mixed.txt', 'utf-8').split('\n');
const numberOfWords = words.length;
var moment = require('moment');
const numberOfSqauresPrime = 20408459;
const rangeOfX = 5241
const rangeOfY = 3894

var mapArray = []
for(let i = 0; i < rangeOfY; i++) {
    mapArray.push([])
    for(let j = 0; j < rangeOfX; j++) {
        mapArray[i].push('')
    }
}

fillWithSpiralIndexes()
console.log("ready")

const logPath = "server/tests-logs";

// ut_genKey();
// ut_generateWordIndexesMult();
// ut_genPhrase();
// ut_varietyTest();
ut_extremeTest();

function ut_genKey() {

    let it = 0

    for(let i = 0; i < 1000; i++) {
        let r = Math.floor(Math.random()*(numberOfSqauresPrime-1+1)+1);
        let timeStart = moment();
        let key = genKey(r, timeStart.format('x'));
        let timeEnd = moment();
        let diff = timeEnd.diff(timeStart, 'milliseconds');

        let success = key == -1 ? "Failed" : "Success"
        // console.log(success + " | " + r + " | " + key + " | " + diff + " ms");
        fs.appendFileSync(logPath + '/ut_genKey.log', success + " | Test case: " + r + " | Key generated: " + key + " | Time taken: " + diff + " ms" + '\n');

        it += diff;

    }
    fs.appendFileSync(logPath + '/ut_genKey.log', "Average time to generate key: " + it/1000 + " ms")

    console.log("done")
    

}

function genKey(val) {

    let min = 2, max = Math.pow(numberOfWords, 2);

    while(true) {
            r = Math.floor(Math.random()*(max-min+1)+min);
            if(r % numberOfSqauresPrime == val) {
                return r;
            }      
    }
    
}


function ut_generateWordIndexesMult() {

    let it = 0, successIt = 0, failIt = 0;

    for(let i = 0; i < 1000; i++) {
        let r = Math.floor(Math.random()*(numberOfSqauresPrime-1+1)+1);

        let error = true
        let index = 0;
        let res, key;

        let timeStart = moment();
        while(error == true) {
            index++
            key = genKey(r) // generate key
            res = generateWordIndexesMult(key) // generate word indexes from key
            error = res['error'] // set error to error status
            if(index >= 100) {
                break;
            }
        }
        let timeEnd = moment();
        let diff = timeEnd.diff(timeStart, 'milliseconds');

        let success = ""
        if(res['error'] == false) {
            successIt++;
            success = 'Success'
            it += diff;
        }
        else {
            failIt++;
            success = 'Failed'
        }

        fs.appendFileSync(logPath + '/ut_generateWordIndexesMult.log', success + " | Test case: " + key + " | Indexes generated: " + (res['a'] ? res['a'] : "N/A") + ", " + (res['b'] ? res['b'] : "N/A") + " | Time taken: " + diff + " ms" + '\n');

    }

    fs.appendFileSync(logPath + '/ut_generateWordIndexesMult.log', "Average time to generate key: " + it/1000 + " ms");
    fs.appendFileSync(logPath + '/ut_generateWordIndexesMult.log', "Fail rate: " + failIt/1000*100 + "%");
    fs.appendFileSync(logPath + '/ut_generateWordIndexesMult.log', "Success rate: " + successIt/1000*100 + "%");

}

function generateWordIndexesMult(sum) {

    let index = 0
    while(index < 1000000) {
        let i = Math.floor(Math.random()*(numberOfWords-1+1)+1)
        if(sum % i == 0 && sum/i <= numberOfWords) {
            return { 'a': i, 'b': sum/i, 'error': false }
        }
        index++
    }
    return { 'error': true }

}


function ut_genPhrase() {

    let it = 0, successIt = 0, failIt = 0;
    let success = ""

    for(let i = 0; i < 1000; i++) {

        let timeStart = moment();
        let testLong = Math.floor(Math.random()*((-5354)-(-10594)+1)+(-10594));
        let testLat = Math.floor(Math.random()*(55371-(51478)+1)+(51478));
        let res = genPhrase(testLong/1000, testLat/1000);
        let timeEnd = moment();
        let diff = timeEnd.diff(timeStart, 'milliseconds');

        if(res['error'] == false) {
            it += diff;
            successIt++;
            success = 'Success'
        }
        else {
            failIt++;
            success = 'Failed'
        }
        fs.appendFileSync(logPath + '/ut_genPhrase.log', success + " | Test coords: {" + res['newLong'] + ", " + res['newLat'] + "} | Phrase generated: " + (res['error'] == false ? res['word1'] : "N/A") + ", " + (res['error'] == false ? res['word2'] : "N/A") + " | Time taken: " + diff + " ms" + '\n');

    }

    fs.appendFileSync(logPath + '/ut_genPhrase.log', "Average time to generate phrase: " + it/1000 + " ms");
    fs.appendFileSync(logPath + '/ut_genPhrase.log', "Fail rate: " + failIt/1000*100 + "%");
    fs.appendFileSync(logPath + '/ut_genPhrase.log', "Success rate: " + successIt/1000*100 + "%");

}

function genPhrase(long, lat) {

    let longitude = long // request long
    let latitude = lat // request lat


    let realX = Math.round(longitude * -1 * 1000) - 5353 // remove x constraints
    let realY = Math.round(latitude * 1000) - 51478 // remove y constraints


    let indexSpiral = mapArray[realY][realX];

    let key, wordIndexes, index = 0
    let error = true
    while(error == true) {

        index++

        key = genKey(indexSpiral) // generate key
        wordIndexes = generateWordIndexesMult(key) // generate word indexes from key
        error = wordIndexes.error // set error to error status
        if(index >= 100) {
            break
            index = 0
            indexSpiral++
        }

    }
    
    return {
        'error': error,
        'word1': words[wordIndexes.a] ? words[wordIndexes.a] : "N/A",
        'word2': words[wordIndexes.b] ? words[wordIndexes.b] : "N/A",
        'newLat': (realY + 51478) / 1000,
        'newLong': (realX + 5353) / 1000 * -1
    }

}


function ut_varietyTest() {

    let it = 0;

    for(let i = 0; i < 120; i++) {

        

        let testLong = Math.floor(Math.random()*((-5354)-(-10594)+1)+(-10594));
        let testLat = Math.floor(Math.random()*(55371-(51478)+1)+(51478));

        let pairs = [], allPairs = []
        for(let j = 0; j < 8; j++) {
            
            let res = genPhrase(testLong/1000, testLat/1000);

            if(res['error'] == false) {
                if(allPairs.includes(res['word1'] + res['word2']) || allPairs.includes(res['word2'] + res['word1'])) {

                }
                else {
                    pairs.push("[ " + res['word1'] + "," + res['word2'] + " ]")
                    allPairs.push(res['word1'] + res['word2'])
                    allPairs.push(res['word2'] + res['word1'])
                }
            }
            else {

            }
        }

        it += pairs.length;
        fs.appendFileSync(logPath + '/ut_varietyTest.log', "Test coords: {" + testLong/1000 + ", " + testLat/1000 + "} | Total number of variety: " + pairs.length + " | Phrases: " + pairs.toString() + "\n");

    }

    fs.appendFileSync(logPath + "/us_varietyTest.log", "Average phrases per location: " + it/120);

}


function ut_extremeTest() {

    // test latitude extremes
    let fixedLatDown = 51.5;
    let fixedLatUp = 55.3;
    let success_LAT = 0;
    let it_LAT = 0
    for(let i = -10593; i < -5354; i += 26) {
        it_LAT += 2;
        let res1 = genPhrase(i/1000, fixedLatUp);
        let res2 = genPhrase(i/1000, fixedLatDown);

        if(res1['error'] == false) {
            fs.appendFileSync(logPath + "/ut_extremeTest_LAT.log", "SUCCESS | Type: TOP | Test coodinates: (" + res1['newLong'] + "," + res1['newLat'] + ") | Phrase: " + res1['word1'] + " " + res1['word2'] + "\n");
            success_LAT++;
        }
        else {
            fs.appendFileSync(logPath + "/ut_extremeTest_LAT.log", "FAIL | Type: TOP | Test coodinates: (" + res1['newLong'] + "," + res1['newLat'] + ") | Phrase: N/A\n");
        }

        if(res2['error'] == false) {
            fs.appendFileSync(logPath + "/ut_extremeTest_LAT.log", "SUCCESS | Type: BOTTOM | Test coodinates: (" + res2['newLong'] + "," + res2['newLat'] + ") | Phrase: " + res2['word1'] + " " + res2['word2'] + "\n");
            success_LAT++;

        }
        else {
            fs.appendFileSync(logPath + "/ut_extremeTest_LAT.log", "FAIL | Type: BOTTOM | Test coodinates: (" + res2['newLong'] + "," + res2['newLat'] + ") | Phrase: N/A\n");
        }
    }
    fs.appendFileSync(logPath + "/ut_extremeTest_LAT.log", "Total successful trials along the latitude extremes: " + success_LAT + "/" + it_LAT + " (" + success_LAT/it_LAT*100 + "%)");


    // test longitude extremes
    let success_LONG = 0;
    let fixedLongLeft = -10.5;
    let fixedLongRight = -5.4;
    let it_LONG = 0;
    for(let i = 51478; i < 55371; i += 26) {
        it_LONG += 2;
        let res1 = genPhrase(fixedLongLeft, i/1000);
        let res2 = genPhrase(fixedLongRight, i/1000);

        if(res1['error'] == false) {
            fs.appendFileSync(logPath + "/ut_extremeTest_LONG.log", "SUCCESS | Type: LEFT | Test coodinates: (" + res1['newLong'] + "," + res1['newLat'] + ") | Phrase: " + res1['word1'] + " " + res1['word2'] + "\n");
            success_LONG++;
        }
        else {
            fs.appendFileSync(logPath + "/ut_extremeTest_LONG.log", "FAIL | Type: LEFT | Test coodinates: (" + res1['newLong'] + "," + res1['newLat'] + ") | Phrase: N/A\n");
        }

        if(res2['error'] == false) {
            fs.appendFileSync(logPath + "/ut_extremeTest_LONG.log", "SUCCESS | Type: RIGHT | Test coodinates: (" + res2['newLong'] + "," + res2['newLat'] + ") | Phrase: " + res2['word1'] + " " + res2['word2'] + "\n");
            success_LONG++;

        }
        else {
            fs.appendFileSync(logPath + "/ut_extremeTest_LONG.log", "FAIL | Type: RIGHT | Test coodinates: (" + res2['newLong'] + "," + res2['newLat'] + ") | Phrase: N/A\n");
        }
    }
    fs.appendFileSync(logPath + "/ut_extremeTest_LONG.log", "Total successful trials along the long extremes: " + success_LONG + "/" + it_LONG + " (" + success_LONG/it_LONG*100 + "%)");

}



function fillWithSpiralIndexes() {

    let index = numberOfSqauresPrime -1
 
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