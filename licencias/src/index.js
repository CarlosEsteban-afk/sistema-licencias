const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const providerStates = require('./providerStates');

const app = express();
app.use(bodyParser.json());

app.use('/', routes);
app.use('/', providerStates);

app.listen(3000, () => console.log('Licencias service running on port 3000'));
