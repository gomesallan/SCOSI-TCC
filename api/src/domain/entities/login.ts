import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client'
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient()

export type LoginProps = {
    cod:string;
};

export class Login extends Entity<LoginProps> {
    private constructor(props: LoginProps, id?: string){
        super(props,id);
    }

    static async login(req:Request,res:Response){

        const { cod } : LoginProps= req.body;

        // if(cod === "@bgraf1298"){
        //     const token = jwt.sign({ id: "@bgraf1298"}, authConfig.secret,{});
        //     await prisma.token.create({
        //         data:{
        //             token: token,
        //             usuario: "BGRAF",
        //             data:new Date()
        //         }
        //     });
        //     res.json({
        //             code:200,
        //             token:token
        //         });
        // }else{
        //     res.json({
        //         code:401,
        //         error:"Login e/ou senha incorretos"
        //     })
        // }

    }
    
}