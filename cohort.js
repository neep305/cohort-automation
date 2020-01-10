const req_cohort = require('./index');


// req_cohort.download(null, function(data) {
//     console.log('data: ', data);
// });

req_cohort.request({cohort:'lzscbhq'}).then(
    (data) => {
        console.log(data);

        if (data.result == 'ok') {
            // get request_id
            if (data.msg.request_id) {
                req_cohort.checkstatus(data.msg).then((status) => {
                    if (status.result == 'ok') {
                        if (status.msg.async_status == 'JOB_COMPLETED') {
                            req_cohort.download(status.msg, (result) => {
                                console.log(result);
                            });
                        } else {
                            // console.log('JOB IN PROGRESS: ', status);
                            
                        }
                    } 
                }, (err) => {
                    console.log('check status err: ', err);
                });
            }
        } else {
            console.log('request fail: ', data.msg);
        }        
    }, (error) => {
        console.log(error);
    }
);