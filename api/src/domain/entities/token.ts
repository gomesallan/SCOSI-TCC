import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type TokenProps = {
    id:number;
    token: string;
    usuario: string;  
    data?: Date; 
    status?: number;  
};

export class Token extends Entity<TokenProps> {
    private constructor(props: TokenProps, id?: string){
        super(props,id);
    }

    static async create(req:Request,res:Response){

        const { token,usuario } : TokenProps= req.body;

        await prisma.token.create({
            data:{
                token: token,
                usuario: usuario,
                data:new Date()
            }
        });

        return res.send(200);
    }
    static async update(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        const { status } : TokenProps= req.body;
        
        await prisma.token.update({
            where:{
                id:idd
            },
            data:{
                status
            }
        });

        return res.send(200);
    }

    static async firstPerCod(req:Request,res:Response){

        const {cod} = req.params;

        const allUsers = await prisma.protudo.findFirst({
            where:{
                cod
            }
        })
        console.log(allUsers)
        return res.send(allUsers)
    }
}