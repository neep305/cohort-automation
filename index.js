const request = require('request');
const fs = require('fs');
const parse = require('csv-parse');

require('dotenv').config();

const amp_token = process.env.AMP_TOKEN;
const amp_secret = process.env.AMP_SECRET;

let AMPLITUDE_COHORT_ENDPOINT = 'https://amplitude.com/api/5/cohorts/request/';
let AMPLITUDE_COHORT_STATUS_ENDPOINT = 'https://amplitude.com/api/5/cohorts/request-status/';

module.exports = {
    request: (param) => {
        return new Promise((resolve, reject) => {
            const resp = request.get(AMPLITUDE_COHORT_ENDPOINT + param.cohort + '?props=0', {
                auth: {
                    user: amp_token,
                    pass: amp_secret
                }
            }, (error, response, body) => {
                console.log('body: ', body);
                let data = JSON.parse(body);
                if (error) {
                    reject({result: 'err', msg: error});
                } else {
                    resolve({result: 'ok', msg: {cohort_id: data.cohort_id, request_id: data.request_id}});
                }

            });
        });
    },
    checkstatus: (param) => {
        return new Promise((resolve, reject) => {
            const resp = request.get(AMPLITUDE_COHORT_STATUS_ENDPOINT + param.reqest_id, {
                auth: {
                    user: amp_token,
                    pass: amp_secret
                }
            }, (error, response, body) => {
                if (error) {
                    reject({result: 'err', msg: error});
                } else {
                    if (body) {
                        if (body.async_staus == 'JOB COMPLETED') {
                            resolve({result: 'ok', msg: body});
                        } else {
                            // still job in progress
                            setTimeout(() => {
                                this.checkstatus(param);
                            }, 60000);
                        }
                    } else {
                        reject({result: 'err', msg: error});
                    }
                }
            })
        });
    },
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
            , uri: 'https://amplitude.com/api/5/cohorts/request/' + param.request_id + '/file'
            , auth: {user: amp_token, pass: amp_secret}
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