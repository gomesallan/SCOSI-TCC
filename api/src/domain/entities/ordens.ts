import { Entity } from '../../core/domain/Entity';
import { PrismaClient } from '@prisma/client'
import {Request, Response} from 'express';
import { ProdutoProps } from './produto';
import {Ean} from './ean';
import {EanProps} from './ean';
var slug = require('slug')

const prisma = new PrismaClient();

type OrdensProps = {
    lote:number;
    cod_produto:number;
    data?: Date;    
};

export class Ordens extends Entity<OrdensProps> {
    private constructor(props: OrdensProps, id?: string){
        super(props,id);
    }
    
    static async listOrdens(req:Request,res:Response){

        const nserie = await prisma.ordens.findMany({
            take: 30,
            orderBy:{id:'desc' }
        });

        return res.send({data: nserie});
    };

    static async delete(req:Request,res:Response){
        try{
            await prisma.ordens.delete({
                where:{
                    id:1
                }
            });

            return res.json({code:200, data: ''});
        }catch(e){

        }
    }

    
}