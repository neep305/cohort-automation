const req_cohort = require('./index');

req_cohort.download(null, function(data) {
    console.log('data: ', data);
});