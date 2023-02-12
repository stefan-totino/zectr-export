const serverless = require('serverless-http');
const express = require('express');
const pptxgen = require('pptxgenjs');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index.html', async (req, res) => {
    let pres = new pptxgen();
    let slide = pres.addSlide();
    let textboxText = "Hello World from PptxGenJS!";
    let textboxOpts = { x: 1, y: 1, color: "363636" };

    slide.addText(textboxText, textboxOpts);
    pres.writeFile();

    res.send("<h1>ZECTR</h1><div>2023<div/>")
})

module.exports.handler = serverless(app);
