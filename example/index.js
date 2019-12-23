const request = require('request');
const fs = require('fs');
const parse = require('csv-parse');

module.exports = {
    download: (param, callback) => {
        const ws = fs.createWriteStream('cohort-test.csv');
        const parser = parse({delimiter: ','}, (err, records, info) => {
            if (err) {
                console.log(err);
                callback({result:"err", data: null});
            } else {
                console.log('parsed data');
                callback({result:"ok", data: records});
            }

            ws.close();
        });

        ws.on('finish', () => {
            console.log('ws finish: ', ws.path);
            fs.createReadStream(ws.path).pipe(parser);
        });

        ws.on('error', (err) => {
            console.log(err);
        });

        request(
            { method: 'GET'
            , uri: 'https://amplitude.com/api/5/cohorts/request/VQipfz/file'
            , auth: {user:'56d54c6d801092b4e8718b40c87a5441', pass:'0ebde0387b79b1822b674d2667525ce2'}
            }
        , function (error, response, body) {
                // body is the decompressed response body
                console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
                // console.log(response);
                console.log('the decoded data is: ' + body)
                
            }
        )
        .on('data', function(data) {
            // decompressed data as it is received
            console.log('2. decoded chunk: ' + data)
        })
        .on('response', function(response) {
            // const ws = fs.createWriteStream('cohort.csv');
            response.pipe(ws);
            // unmodified http.IncomingMessage object
            response.on('data', function(data) {
                // compressed data as it is received
                console.log('1. received ' + data.length + ' bytes of compressed data')
            })
        })
    }
}