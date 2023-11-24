import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type ProdutoProps = {
    id:number;
    nome: string;
    cod: number;  
    data_cadastro?: Date; 
    ativo?: number;
    etiqueta_id:number;
};

export class Produto extends Entity<ProdutoProps> {
    private constructor(props: ProdutoProps, id?: string){
        super(props,id);
    }

    static async cadastrar(req:Request,res:Response){

        const { nome,cod,etiqueta_id } : ProdutoProps= req.body;

        try{
            await prisma.produto.create({
                data:{
                    nome: nome,
                    data_cadastro:new Date(),
                    cod: cod,
                    etiqueta_id:etiqueta_id,
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
             res.status(500).send({errorCode:e.message})
            }
            console.log(e)
      }
    }
    static async alterar(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        const { nome,cod,etiqueta_id,ativo } : ProdutoProps= req.body;
        
        try{
            await prisma.produto.update({
                where:{
                    id:idd
                },
                data:{
                    nome: nome,
                    cod: cod,
                    ativo:ativo,
                    etiqueta_id:etiqueta_id,
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }
    static async listarTodos(req:Request,res: Response){

        const {cod,pg}:any = req.body;
        const codlike = `%${cod}%`; 
        console.log(cod);
        try{
          const produto = await prisma.produto.findMany({include:{etiqueta:true}})
    
          return res.send(produto);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }
    static async listarAtivos(req:Request,res: Response){

        const {cod,pg}:any = req.body;
        const codlike = `%${cod}%`; 
        console.log(cod);
        try{
          const produto = await prisma.produto.findMany({include:{etiqueta:true},where:{ativo:1}})
    
          return res.send(produto);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }

    
}