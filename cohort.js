const req_cohort = require('./index');


// req_cohort.download(null, function(data) {
//     console.log('data: ', data);
// });

req_cohort.request({cohort:'lzscbhq'}).then(
    (data) => {
        console.log(data);
    }, (error) => {
        console.log(error);
    }
);