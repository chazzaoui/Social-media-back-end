const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const feedRoutes = require('./routes/feed');

app.use(bodyParser.json()); //this will make incoming data be parsed to json .

app.use((req, res, next) => {  // here i want to add headers so i can allow requests from different servers to be allowed in the app
res.setHeader('Access-Control-Allow-Origin', '*'); // here we allow specific origins to allow our data, the * makes evreyone able to acces it
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT'); // here we specify which methods are allowed from the request
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //specifies which header types are allowed
next();
})
app.use('/feed', feedRoutes);

app.listen(8080);