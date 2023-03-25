/*
* buckets controller
*/

'use strict'

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const bucketsAPI = express();
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

bucketsAPI.get('/buckets', async (req, res) => {
    let listBucketsResult = {};
    s3.listBuckets(function (err, data) {
        if (err) {
            // TODO: is this error message working ('JSON.' is concerning)?
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

bucketsAPI.use(bodyParser.json());
bucketsAPI.use(bodyParser.urlencoded({ extended: true }));
module.exports.handler = serverless(bucketsAPI);
