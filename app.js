const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require ('custom-env').env('staging')



const feedRoutes = require('./routes/feed');

app.use(bodyParser.json()); //this will make incoming data be parsed to json .
app.use('./images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {  // here i want to add headers so i can allow requests from different servers to be allowed in the app
res.setHeader('Access-Control-Allow-Origin', '*'); // here we allow specific origins to allow our data, the * makes evreyone able to acces it
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT'); // here we specify which methods are allowed from the request
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //specifies which header types are allowed
next();
})
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message; //can be set globally in script by setting error.message
    res.status(status).json({message})
})

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true }  )
.then(() => {

    app.listen(8080);
})
.catch(err => console.log(err))
