/*
* slides controller
*/

'use strict'

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const slidesAPI = express();
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const pptxWriteOpt = 'write';

function writeFileThen(rslt, bucket) {
    let fileStream = fs.createReadStream(rslt);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    let params = { Bucket: bucket, Key: path.basename(rslt), Body: fileStream };
    s3.upload(params, function (err, data) {
        if (err) {
            console.log('Error', err);
        } if (data) {
            console.log('Upload Success', data.Location);
        }
    });

    // TODO: wait until upload is complete, then remove the file from drive
}

function writeThen(base64Str, byteFilename, bucket) {
    let params = { Bucket: bucket, Key: byteFilename, Body: Buffer.from(base64Str, 'base64') };
    s3.upload(params, function (err, data) {
        if (err) {
            console.log('Error', err);
        } if (data) {
            console.log('Upload Success', data.Location);
        }
    });
}

slidesAPI.post('/slides', async (req, res) => {
    // dev. bucket
    let bucket = 'zectr-io-build';

    // dev. filenames
    let flatFileName = 'hello_world_from_file.pptx';
    let byteFilename = 'hello_world_from_bytes.pptx';

    // dev. slide
    let pptx = new pptxgen();
    let slide = pptx.addSlide();
    let textboxText = 'Hello World from ZECTR via PptxGenJS';
    let textboxOpts = { x: 1, y: 1, color: '363636' };
    slide.addText(textboxText, textboxOpts);

    switch (pptxWriteOpt) {
        case ('writeFile'):
            pptx.writeFile({ fileName: flatFileName })
                .then(rslt => writeFileThen(rslt, bucket));
            break;
        case ('write'):
            pptx.write('base64')
                .catch((err) => {
                    throw new Error(err);
                })
                .then((base64Str) => writeThen(base64Str, byteFilename, bucket))
                .catch((err) => {
                    console.log(`ERROR: ${err}`);
                });
            break;
        default:
            console.log(`unsupported pptxgenJS output file format: ${pptxWriteOpt}`);
    }

    res.json({ requestBody: req.body })
})

slidesAPI.use(bodyParser.json());
slidesAPI.use(bodyParser.urlencoded({ extended: true }));
module.exports.handler = serverless(slidesAPI);
