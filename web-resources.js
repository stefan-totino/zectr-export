const [serverless, express] = [require('serverless-http'), require('express')];
const [app, bodyParser] = [express(), require('body-parser')];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index.html', async (req, res) => {
    await res.send("<h1>ZECTR</h1><div>2023<div/>")
})

module.exports.handler = serverless(app);
