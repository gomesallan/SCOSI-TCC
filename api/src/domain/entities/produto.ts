import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type ProdutoProps = {
    id:number;
    nome: string;
    cod: string;  
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
    static async buscarPorCod(req:Request,res: Response){

        const {cod,pg}:any = req.body;
        const codlike = `%${cod}%`; 
        console.log(cod);
        try{
          const produto = await prisma.$queryRaw(
            Prisma.sql`SELECT * FROM produto WHERE cod LIKE ${codlike} LIMIT 20 OFFSET ${(pg - 1) * 20}`
          )
    
          return res.send(produto);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }
    static async buscarAtivoPorCod(req:Request,res: Response){

        const {cod,pg}:any = req.body;
        const codlike = `%${cod}%`; 
        console.log(cod);
        try{
          const produto = await prisma.$queryRaw(
            Prisma.sql`SELECT * FROM produto WHERE ativo = 1 AND cod LIKE ${codlike} LIMIT 20 OFFSET ${(pg - 1) * 20}`
          )
    
          return res.send(produto);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }

    
}