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

'use strict'

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const app = express();

// TODO: console notifications need to be rolled into some kind of result object
// TODO: optional key and body to fill out the upload params, also file is optional

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
module.exports.handler = serverless(app);
