'use strict'

/*
    https://expressjs.com/
    https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-upload-file
*/

/* 
TODO:
    configuration file for AWS parameters. write ppts and xls to bucket
    accept multiple commands over HTTP. database?
    begin to encode dad's language and business logic. error handling (result object)
    RUST integration. JWT Auth
*/

const serverless = require('serverless-http');
const express = require('express');
const pptxgen = require('pptxgenjs');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// TODO: where should i scope these?
const s3 = new AWS.S3();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function uploadS3(bucketName, file) {
    // TODO: console notifications need to be rolled into some kind of result object
    let uploadParams = { Bucket: bucketName, Key: '', Body: '' };
    let fileStream = fs.createReadStream(file);

    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}

app.get('/index.html', async (req, res) => {
    let html = `<h1>ZECTR</h1><h3>export</h3><div>2023</div>`;
    res.send(html)
})

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

app.post('/slides', (req, res) => {
    let pres = new pptxgen();
    let slide = pres.addSlide();
    let textboxText = "Hello World from PptxGenJS!";
    let textboxOpts = { x: 1, y: 1, color: "363636" };
    slide.addText(textboxText, textboxOpts);
    pres.writeFile();
    uploadS3("zectr-io-build", "Presentation.pptx");
    res.json({ requestBody: req.body })
})

module.exports.handler = serverless(app);
