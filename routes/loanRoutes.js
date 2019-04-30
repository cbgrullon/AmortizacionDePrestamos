'use strict'
const router = require('express').Router();

const controller =require('../controllers/loanController')
router.post('/GeneraAmortizacion',(req,res)=>{
    return controller.GenerateTable(req,res);
});

module.exports= exports= router;