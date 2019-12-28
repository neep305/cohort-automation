const req_cohort = require('./index');


// req_cohort.download(null, function(data) {
//     console.log('data: ', data);
// });

req_cohort.request({cohort:'lzscbhq'}).then(
    (data) => {
        console.log(data);

        let result = JSON.parse(data.result);

        // get request_id
        if (data.request_id) {
            req_cohort.checkstatus(result).then((status) => {
                if (status.async_status == 'JOB_COMPLETED') {
                    req_cohort.download(data, (result) => {
                        console.log(result);
                    })
                } else {
                    req_cohort.checkstatus(result);
                }
            }, (err) => {

            });
        }
    }, (error) => {
        console.log(error);
    }
);