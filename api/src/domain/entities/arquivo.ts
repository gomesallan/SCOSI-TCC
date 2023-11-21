import { Entity } from '../../core/domain/Entity';
const fastcsv = require("fast-csv");
import { parseFile } from 'fast-csv';
const fs = require("fs");

import { PrismaClient } from '@prisma/client'
import {Request, Response} from 'express';
import { Ean, EanProps } from './ean';
import { Ordem } from './ordem';

const prisma = new PrismaClient();

export type ArquivoProps = {
    nserie: string;
};

export class Arquivo extends Entity<ArquivoProps> {
    private constructor(props: ArquivoProps, id?: string){
        super(props,id);
    }
    
    static async gerarArquivo(req:Request,res:Response){
        const oredem_id:number = parseInt(req.params.ordem_id)
        const ordem:any = await Ordem.carregarPorId(oredem_id);
        if(!ordem)
            return res.status(401).send({ error: 'Ordem de serviço inválida!'});
        const eanProps : EanProps = {
            cod_produto:ordem.produto.cod,
            lote: ordem.lote,
            qtd:ordem.qtd,
            etiqueta: ordem.produto.etiqueta.referencia
        };
        console.log(eanProps)
        
        var nserie = Ean.unifyParams(eanProps);

        console.log(nserie);
        if(!nserie)
            return res.status(400).send({error:"Produto ou lote inválido."});
        const Arquivo = 'data/'+eanProps.etiqueta+'-'+eanProps.cod_produto+'-'+eanProps.lote+".csv";
        const ws = fs.createWriteStream(Arquivo);
    
        await fastcsv
        .write(nserie, { headers: true })
        .on("finish", function() {
            console.log("Write to CSV successfully!");
            
        })
        .pipe(ws);
        
        setTimeout(function(){
            return res.download(Arquivo,function(err){
                if(err){
                    console.log(err);
                }
                fs.unlink(Arquivo, function(){
                    console.log("Arquivo was deleted")
                })
            });
        },5000);

        
    }


}