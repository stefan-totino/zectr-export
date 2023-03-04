
/*
* index controller
*/

(function () {
    'use strict'

    const serverless = require('serverless-http');
    const express = require('express');
    const bodyParser = require('body-parser');
    const indexAPI = express();

    indexAPI.get('/index.html', async (req, res) => {
        let html = `<h1>ZECTR</h1><h3>export</h3><div>2023</div>`;
        res.send(html)
    })

    indexAPI.use(bodyParser.json());
    indexAPI.use(bodyParser.urlencoded({ extended: true }));
    module.exports.handler = serverless(indexAPI);

    

}());