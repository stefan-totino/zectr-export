'use strict'

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

// TODO: this is for dev only, i am not going to allow the app to be configured to switch on this in prod. the best solution will be chosen
const pptxWriteOpt = 'write';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/index.html', async (req, res) => {
    let html = `<h1>ZECTR</h1><h3>export</h3><div>2023</div>`;
    res.send(html)
})

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

app.post('/slides', (req, res) => {
    let pptx = new pptxgen();
    let slide = pptx.addSlide();
    let textboxText = 'Hello World from ZECTR via PptxGenJS';
    let textboxOpts = { x: 1, y: 1, color: '363636' };
    let flatFileName = 'flat_file_empty_pres.pptx';
    // TODO: get this from list buckets result
    let bucketName = 'zectr-io-build';

    slide.addText(textboxText, textboxOpts);

    switch (pptxWriteOpt) {
        case ('writeFile'):
            pptx.writeFile({ fileName: flatFileName })
                .then(rslt => {
                    uploadS3(bucketName, rslt);
                    fs.unlink(rslt, (errCllbck) => { });
                });
            break;
        case ('write'):
            pptx.write("base64")
                .catch((err) => {
                    throw new Error(err);
                })
                .then((data) => {
                    console.log(`BASE64 TEST: First 100 chars of 'data':\n`);
                    console.log(data.substring(0, 99));
                })
                .catch((err) => {
                    console.log(`ERROR: ${err}`);
                });
            break;
        case ('stream'):
        default:
            console.log(`unsupported pptxgenJS output file format: ${pptxWriteOpt}`);
    }

    res.json({ requestBody: req.body })
})

module.exports.handler = serverless(app);
