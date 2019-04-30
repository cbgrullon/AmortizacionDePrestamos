'use strict'
const express = require('express');
const cors= require('cors');
const bodyParser = require('body-parser');

let api = express();
api.use(bodyParser.json());
api.use(cors());

const loanRoutes = require('./routes/loanRoutes');

api.use('/api/Prestamos',loanRoutes);

const port = process.env.PORT || 5050;
api.listen(port,()=>{
    console.log(`Api Listen Port ${port}`)
})