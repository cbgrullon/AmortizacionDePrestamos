'use strict'
const numeral = require('numeral');
function GenerateTable(req,res){
    let montoTotal, interesAnual,plazo,interesMensual,cuotaMensual;
    //Calculo de Cuota
    montoTotal = req.body.montoTotal;
    interesAnual = req.body.interesAnual;
    plazo = parseFloat(req.body.plazo);
    let abonos = req.body.abonos;
    if(!montoTotal || !interesAnual ||! plazo)
        return res.status(400).send({message:'Faltan campos por completar'});
    interesMensual = (interesAnual /12)/100;
    let cuotaMensualOriginal = cuotaMensual =generaCuotaMensual({interesMensual,montoTotal,plazo});
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
    var abonosIncluidos = 0;
    for(var index =1; index<= plazo +(abonos ? abonos.length:0); index++){
        if(abonos)
        {
            let abono  = abonos.find((item)=>{
                return index===item.cuota;
            });
            if(abono){
                abonosIncluidos++;
                if(saldo < abono.monto)
                    return res.status(400).send({message:`El abono a Capital en la Cuota ${abono.cuota}, con el Monto de: $${abono.monto} es mayor al saldo pendiente: $${saldo}`});
                saldo-= abono.monto;
                cuotaMensual = generaCuotaMensual({interesMensual,montoTotal:saldo,plazo:plazo+abonosIncluidos-index})
                
                amortizacion.push({
                    cuota:index,
                    capital:abono.monto,
                    interes:0,
                    total: abono.monto,
                    saldo:format(saldo)
                });
                continue;
            }
        }
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
    return res.status(200).send({cuotaMensual:cuotaMensualOriginal,amortizacion});
}
function format(input){
    let num = numeral(input);
    let formatted = num.format('0.00');
    return parseFloat(formatted);
}
function generaCuotaMensual({interesMensual,montoTotal,plazo}){
    return montoTotal*((interesMensual*Math.pow((1+interesMensual),plazo) /(Math.pow((1+interesMensual),plazo)-1)));
}
module.exports = exports = {GenerateTable}