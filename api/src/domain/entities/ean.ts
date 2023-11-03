import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';


export type EanProps = {
    cod_produto:string,
    lote:number,
    qtd:number,
    etiqueta:string,
    comex:number,
}

export class Ean extends Entity<EanProps>{
    static unifyParams(eanProps : EanProps){

        var array = [];

        for(var i = 1; i <= eanProps.qtd;i++){
            var ean12:string = '';
            ean12 = '5'+
            ("00000"+eanProps.cod_produto).slice(-5)+
            ("000"+eanProps.lote).slice(-3)+
            ("000"+i).slice(-3);
            var ean13:string = ean12+this.verifycationCod(ean12);
            array.push({nserie:ean13})
        }
        
        return array;
    }

    static verifycationCod(ean:string){
        const eanSplit: string[] = ean.split('');
        var cont = 1;
        var totalSoma = 0
        var result = 0;
        eanSplit.forEach(element => {
            var elementInt:number = +element;
            if(cont % 2 === 0){
                totalSoma += elementInt * 3;
            }
            if(cont % 2 !== 0){
                totalSoma += elementInt * 1;
            }
            cont++;

        });
        result = ((Math.floor(totalSoma/10) + 1) * 10) - totalSoma;
        if(result % 10 == 0){
            result = 0
        }
        // console.log(result);
        return result;
    }
    
}
// 5 1 = 5 
// 2 3 = 6
// 9 1 = 9
// 8 3 = 24
// 7 1 = 7
// 5 3 = 15
// 5 1 = 5
// 6 3 = 18
// 7 1 = 7
// 0 3 = 0
// 0 1 = 0
// 1 3 = 3

// = 99



