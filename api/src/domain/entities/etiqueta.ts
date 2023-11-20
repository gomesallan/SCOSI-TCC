import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type EtiquetaProps = {
    id:number;
    referencia: string;
    url: string;  
    data_cadastro?: Date; 
    ativo?: number;
};

export class Etiqueta extends Entity<EtiquetaProps> {
    private constructor(props: EtiquetaProps, id?: string){
        super(props,id);
    }

    static async cadastrar(req:Request,res:Response){

        const { referencia,url } : EtiquetaProps= req.body;

        try{
            await prisma.etiqueta.create({
                data:{
                    referencia: referencia,
                    data_cadastro:new Date(),
                    url: url
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
             res.status(500).send({errorCode:e.message})
            }
            res.status(500).send({errorCode:e})
            console.log(e);

      }
    }
    static async alterar(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        const { referencia,url,ativo } : EtiquetaProps= req.body;
        
        try{
            await prisma.etiqueta.update({
                where:{
                    id:idd
                },
                data:{
                  referencia: referencia,
                  url: url,
                  ativo: ativo
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }
    static async buscarPorReferencia(req:Request,res: Response){

        const {referencia,pg}:any = req.body;
        const referencialike = `%${referencia}%`; 
        try{
          const Etiqueta = await prisma.$queryRaw(
            Prisma.sql`SELECT * FROM etiqueta WHERE referencia LIKE ${referencialike} LIMIT 20 OFFSET ${(pg - 1) * 20}`
          )
    
          return res.send(Etiqueta);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }
    static async buscarAtivosPorReferencia(req:Request,res: Response){

        const {pg}:any = req.body;
        const {referencia} : any = req.params;
        const referencialike = `%${referencia}%`; 
        try{
          const Etiqueta = await prisma.$queryRaw(
            Prisma.sql`SELECT * FROM etiqueta WHERE ativo = 1 AND referencia LIKE ${referencialike} LIMIT 20 OFFSET ${(pg - 1) * 20}`
          )
    
          return res.send(Etiqueta);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }

    
}