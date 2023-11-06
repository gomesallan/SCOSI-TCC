import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type ProdutoProps = {
    id:number;
    nome: string;
    img: string;
    cod: string;  
    data?: Date; 
    ativo?: number;
    etiqueta:string;  
    comex: number;
};

export class Produto extends Entity<ProdutoProps> {
    private constructor(props: ProdutoProps, id?: string){
        super(props,id);
    }

    static async create(req:Request,res:Response){

        const { nome,img,cod,comex,etiqueta } : ProdutoProps= req.body;

        await prisma.produto.create({
            data:{
                nome: nome,
                img: img,
                cod: cod,
                data:new Date(),
                comex:comex,
                etiqueta:etiqueta,
            }
        });

        return res.send(200);
    }
    static async update(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        const { nome,img,cod } : ProdutoProps= req.body;
        
        await prisma.produto.update({
            where:{
                id:idd
            },
            data:{
                nome: nome,
                img: img,
                cod: cod,
            }
        });

        return res.send(200);
    }
    static async active(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        const { ativo } : ProdutoProps= req.body;
        
        await prisma.produto.update({
            where:{
                id:idd
            },
            data:{
                ativo: ativo
            }
        });

        return res.send(200);
    }

    static async firstPerCod(req:Request,res:Response){

        const {cod} = req.params;
        try{
            const allUsers = await prisma.produto.findFirst({
                where:{
                    cod
                }
            })
            console.log(allUsers)
            return res.send(allUsers)

        }catch(e){
            // if (e instanceof Prisma.PrismaClientKnownRequestError) {
            //     res.status(500).send({errorCode:e.code})
            // }

        }
    }
}