const serverless = require('serverless-http');
const express = require('express');
const pptxgen = require('pptxgenjs');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index.html', async (req, res) => {
    let pres = new pptxgen();
    let slide = pres.addSlide();
    let textboxText = "Hello World from PptxGenJS!";
    let textboxOpts = { x: 1, y: 1, color: "363636" };

    slide.addText(textboxText, textboxOpts);
    pres.writeFile();

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

        var html = `<h1>ZECTR</h1><h3>export</h3><div>${listBucketsResult}</div>`;
        res.send(html)
    });
})

module.exports.handler = serverless(app);
