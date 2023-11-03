import { Entity } from '../../core/domain/Entity';
import {Request,Response} from 'express';
import {PrismaClient} from '@prisma/client'

import { lookup } from 'geoip-lite';

const prisma = new PrismaClient();

type RequisicaoProps = {
    id?:number;
    ip: string;
    uf?: string;  
    data?: Date;
    verificacao: number;
};

export class Requisicao extends Entity<RequisicaoProps> {
    private constructor(props: RequisicaoProps, id?: string){
        super(props,id);
    }

    static async create( req: Request, res: Response){
        const props: RequisicaoProps = req.body;
        try{
            
            var geo = lookup(props.ip) || {country:'BR2',region:'PR@'};
            await prisma.requisicao.create({
                data:{
                    ip: props.ip,
                    uf:geo.country+'/'+geo.region,
                    data: new Date(),
                    verificacao: props.verificacao
                }
            })
            
            res.send(200);
        }catch(error){
            res.json({
                code:500,
                error:error
            });
        }
    }

    static async listOrderByIdDesc(req: Request,res: Response){
        try{
            const itens_per_page: number = 10;
            const pg:number = +req.body.page;
           const response = await prisma.requisicao.findMany({
               skip:(pg - 1) * itens_per_page,
               take:itens_per_page,
               orderBy:[
                   {
                       id:'desc'
                   }
               ]
           })

           res.send({
               qtd:await prisma.requisicao.count(),
               data:response
            });
        }catch(error){
            
        }
    }
    static async serchOrderByIdDesc(req: Request,res: Response){
        try{
            const itens_per_page: number = 10;
            const pg:number = +req.body.page;
           const response = await prisma.requisicao.findMany({
               skip:(pg - 1) * itens_per_page,
               take:itens_per_page,
               orderBy:[
                   {
                       id:'desc'
                   }
               ],
               where:{
                   uf:req.body.uf
               }
           })

           res.send({
               qtd:await prisma.requisicao.count({where:{uf:req.body.uf}}),
               data:response
            });
        }catch(error){
            
        }
    }
}