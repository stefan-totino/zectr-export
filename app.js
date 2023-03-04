
/*
    https://expressjs.com/
    https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-upload-file
    https://gitbrent.github.io/PptxGenJS/docs/quick-start/
*/

/* 
TODO:
    configuration file for AWS parameters. write ppts and xls to bucket
    accept multiple commands over HTTP. database?
    begin to encode dad's language and business logic. error handling (result object)
    RUST integration. JWT Auth
    send raw file from javascript to s3 (i.e. stream or likes: eliminate dependency on file system temp directory)
*/

(function () {
    'use strict'

    const serverless = require('serverless-http');
    const express = require('express');
    const bodyParser = require('body-parser');
    const AWS = require('aws-sdk');
    const fs = require('fs');
    const path = require('path');

    // TODO: where should i scope these?
    const s3 = new AWS.S3();
    const app = express();

    // TODO: console notifications need to be rolled into some kind of result object
    function uploadS3(bucketName, file) {
        let uploadParams = { Bucket: bucketName, Key: '', Body: '' };
        let fileStream = fs.createReadStream(file);

        fileStream.on('error', function (err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file);
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log('Error', err);
            } if (data) {
                console.log('Upload Success', data.Location);
            }
        });
    }

    // TODO: work on the error return strategy
    app.get('/buckets', async (req, res) => {
        let listBucketsResult = {};
        s3.listBuckets(function (err, data) {
            if (err) {
                listBucketsResult = JSON.stringify(err);
            } else {
                listBucketsResult = data.Buckets.map(function (bucket) {
                    return bucket.Name;
                });
            }
            var html = `<div>${listBucketsResult}</div>`;
            res.send(html)
        });
    })

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // TODO: can these be combined?
    module.exports.handler = serverless(app);
    module.exports = {
        uploadS3
    }

}());
