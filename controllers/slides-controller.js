
/*
* slides controller
*/

(function () {
    'use strict'

    const serverless = require('serverless-http');
    const express = require('express');
    const bodyParser = require('body-parser');
    const slidesAPI = express();
    const fs = require('fs');
    const pptxgen = require('pptxgenjs');
    const app = require('../app');

    // TODO: this is for dev only, i am not going to allow the app to be configured to switch on this in prod. the best solution will be chosen
    const pptxWriteOpt = 'write';

    slidesAPI.post('/slides', async (req, res) => {
        let pptx = new pptxgen();
        let slide = pptx.addSlide();
        let textboxText = 'Hello World from ZECTR via PptxGenJS';
        let textboxOpts = { x: 1, y: 1, color: '363636' };
        let flatFileName = '../hello_world_from_file.pptx';
        // TODO: get this from list buckets result
        let bucketName = 'zectr-io-build';

        slide.addText(textboxText, textboxOpts);

        switch (pptxWriteOpt) {
            case ('writeFile'):
                pptx.writeFile({ fileName: flatFileName })
                    .then(rslt => {
                        // TODO: rslt now carries a bad path, since moving to controllers folder
                        console.log(rslt);
                        app.uploadS3(bucketName, rslt);
                        fs.unlink(rslt, (errCllbck) => { });
                    });
                break;
            case ('write'):
                // TODO: pipe bytes into s3
                pptx.write('base64')
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
            default:
                console.log(`unsupported pptxgenJS output file format: ${pptxWriteOpt}`);
        }

        res.json({ requestBody: req.body })
    })

    slidesAPI.use(bodyParser.json());
    slidesAPI.use(bodyParser.urlencoded({ extended: true }));
    module.exports.handler = serverless(slidesAPI);
}());