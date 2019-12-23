var request = require('request');
var fs = require('fs');

  request(
    { method: 'GET'
    , uri: 'https://amplitude.com/api/5/cohorts/request/VQipfz/file'
    , auth: {user:'56d54c6d801092b4e8718b40c87a5441', pass:'0ebde0387b79b1822b674d2667525ce2'}
    }
  , function (error, response, body) {
      // body is the decompressed response body
      console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
      console.log('the decoded data is: ' + body)

      
        response.pipe(fs.createWriteStream('test.csv'));
    }
  )
  .on('data', function(data) {
    // decompressed data as it is received
    console.log('decoded chunk: ' + data)
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // compressed data as it is received
      console.log('received ' + data.length + ' bytes of compressed data')
    })
  })