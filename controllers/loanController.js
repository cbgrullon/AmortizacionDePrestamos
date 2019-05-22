'use strict'
const numeral = require('numeral');
function GenerateTable(req,res){
    if(!req.body.interes|| !req.body.montoTotal||!req.body.plazo){
        return res.status(400).send({message:'Parametros invalidos'})
    }
    let montoTotal, interesAnual,plazo,interesMensual,cuotaMensual;
    //Calculo de Cuota
    montoTotal = req.body.montoTotal;
    interesAnual = req.body.interesAnual;
    plazo = req.body.plazo;
    interesMensual = (interesAnual /12)/100;
    cuotaMensual =montoTotal*((interesMensual*Math.pow((1+interesMensual),plazo) /(Math.pow((1+interesMensual),plazo)-1)));
    //Cuota 0
    var amortizacion = [];
    amortizacion.push({
        cuota:0,
        capital:0,
        interes:0,
        total:0,
        saldo:montoTotal
    });
    let saldo=montoTotal;
    for(var index =1; index<= plazo; index++){
        let interesActual,capitalAcutal;
        interesActual = saldo*interesMensual;
        capitalAcutal = cuotaMensual-interesActual;
        if(saldo-capitalAcutal < 1){
            capitalAcutal= saldo - interesActual;
            saldo=0.00;
        }else{
            saldo-=format(capitalAcutal);
        }
        
        amortizacion.push({
            cuota:index,
            capital:format(capitalAcutal),
            interes:format(interesActual),
            total: format(capitalAcutal+interesActual),
            saldo:format(saldo)
        });
    }
    return res.status(200).send(amortizacion);
}
function format(input){
    let num = numeral(input);
    let formatted = num.format('0.00');
    return parseFloat(formatted);
}
module.exports = exports = {GenerateTable}