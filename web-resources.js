const serverless = require('serverless-http');
const express = require('express');
const pptxgen = require('pptxgenjs');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

/* 
TODO:
configuration file for AWS parameters
write ppts and xls to bucket
accept multiple commands over HTTP
database?
begin to encode dad's language and business logic
error handling (result object)
RUST integration
*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index.html', async (req, res) => {
    var html = `<h1>ZECTR</h1><h3>export</h3><div>2023</div>`;
    res.send(html)
})

app.get('/buckets', async (req, res) => {

    // AWS.config.update({ region: 'us-east-1' });
    // aws configure list (CLI)
    // TODO: this configuration needs to be parsed at runtime using a proper external file or a database.

    var s3 = new AWS.S3();
    var listBucketsResult = {};
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

app.get('/slides', async (req, res) => {
    let pres = new pptxgen();
    let slide = pres.addSlide();
    let textboxText = "Hello World from PptxGenJS!";
    let textboxOpts = { x: 1, y: 1, color: "363636" };

    slide.addText(textboxText, textboxOpts);
    pres.writeFile();

    res.send()
})

module.exports.handler = serverless(app);
