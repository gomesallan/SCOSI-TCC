import { Entity } from '../../core/domain/Entity';
import { Prisma, PrismaClient, ordem_status } from '@prisma/client'
import {Request, Response} from 'express';
import { ProdutoProps } from './produto';
import {Ean} from './ean';
import {EanProps} from './ean';
var slug = require('slug')

const prisma = new PrismaClient();

type OrdemProps = {
    id:number;
    lote:number;
    qtd:number;
    status: ordem_status;
    produto_id: number;
    parceiro_id: number;
};

export class Ordem extends Entity<OrdemProps> {
    private constructor(props: OrdemProps, id?: string){
        super(props,id);
    }
    
    static async cadastrar(req:Request,res:Response){

        const { lote,qtd,status,produto_id,parceiro_id } : OrdemProps= req.body;
        try{
            if(await prisma.ordem.findFirst({where:{lote:lote,produto_id:produto_id}}))
                return res.status(400).send({ error: "Ordem de serviço já cadastrada!"});
            await prisma.ordem.create({
                data:{
                    data_cadastro:new Date(),
                    data_alteracao:new Date(),
                    lote: lote,
                    qtd:qtd,
                    status:status,
                    produto_id:produto_id,
                    parceiro_id:parceiro_id
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }
    static async alterar(req:Request,res:Response){

        const { lote,qtd,status,produto_id,parceiro_id } : OrdemProps= req.body;
        const id:number = parseInt(req.params.id); 

        try{
            if(await prisma.ordem.findFirst({where:{lote:lote,produto_id:produto_id}}))
                return res.status(400).send({ error: "Ordem de serviço já cadastrada!"});
            const usuariodb = await prisma.ordem.update({
                where:{
                    id:id
                },
                data:{
                    data_alteracao:new Date(),
                    lote: lote,
                    qtd:qtd,
                    status:status,
                    produto_id:produto_id,
                    parceiro_id:parceiro_id
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }
    static async alterarStatus(req:Request,res:Response){

        const { status } : OrdemProps= req.body;
        const id:number = parseInt(req.params.id); 

        const authHeader = req.headers.authorization;
        if(!authHeader)
            return res.status(401).send({ error: 'No token provided'});

        const parts = authHeader.split(' ');
            
        const [scheme, token] = parts;

        try{
            const tk = await prisma.token.findFirst({include:{usuario:true},where:{token:token}})
           if(tk?.usuario.tipo != "Administrador")
                if(status == "Concluido")
                    return res.status(400).send({ error: "Você não tem permissão parar 'Concluir' a Odem de Serviço!"});
            const usuariodb = await prisma.ordem.update({
                where:{
                    id:id
                },
                data:{
                    data_alteracao:new Date(),
                    status:status,
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }

    static async listarPorStatus(req:Request,res:Response){

        const status = req.params.status; 
        if(status !== 'Nova' && status !== 'Defeito' && status !== 'Urgencia' && status !== 'Andamento' && status !== 'Enviado' && status !== 'Concluido' )
            return res.status(401).send({ error: 'Status inválido'});
        try{
            const nserie = await prisma.ordem.findMany({
                include:{ 
                    parceiro:true,
                    produto:{
                        include:{
                            etiqueta:true
                        }
                    }
                },
                where:{
                    status:status
                },
                orderBy:{id:'asc' }
            });
            return res.send({data: nserie});
        }catch(e){
            console.log(e);
      }

    };
    static async listarPorStatusEParceiro(req:Request,res:Response){

        const {status,parceiro}:any = req.params; 
        // const {parceiro_id}:OrdemProps = req.body;
        if(status !== 'Nova' && status !== 'Defeito' && status !== 'Urgencia' && status !== 'Andamento' && status !== 'Enviado' && status !== 'Concluido' )
            return res.status(401).send({ error: 'Status inválido'});
        try{
            const nserie = await prisma.ordem.findMany({
                include:{ 
                    parceiro:true,
                    produto:{
                        include:{
                            etiqueta:true
                        }
                    }
                },
                where:{
                    AND: [
                        {
                            status:status,
                            parceiro_id:parseInt(parceiro)                        
                        }
                    ]
                },
                orderBy:{id:'asc' }
            });
            return res.send({data: nserie});
        }catch(e){
            console.log(e);
      }

    };

    static async carregarPorId(id:number){
        try{
            const ordem:any = await prisma.ordem.findUnique({
                include:{
                    produto:{
                        include:{
                            etiqueta:true
                        }
                    },
                    parceiro:true
                },
                where:{
                    id:id
                }
            });
            
            return ordem;
        }catch(e){
            return e
        }
    }

    static async excluir(req:Request,res:Response){
        const id:number = parseInt(req.params.id); 
        try{    
            await prisma.ordem.delete({
                where:{
                    id:id
                }
            });

            return res.send(200);
        }catch(e){

        }
    }

    
}