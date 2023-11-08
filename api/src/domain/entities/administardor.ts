import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient()

export type AdministradorProps = {
    id:number;
    data_cadastro?:Date;
    nome:string;
    login:string;
    senha:string;
};

export class Administrador extends Entity<AdministradorProps> {
    private constructor(props: AdministradorProps, id?: string){
        super(props,id);
    }

    static async cadastro(req:Request,res:Response){

        const { nome,data_cadastro,login,senha } : AdministradorProps= req.body;

        try{
            await prisma.administrador.create({
                data:{
                    nome: nome,
                    data_cadastro:new Date(),
                    login: login,
                    senha:await bcrypt.hash(senha,10),
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
        const { nome,data_cadastro,login,senha } : AdministradorProps= req.body;
        
        try{
            await prisma.administrador.update({
                where:{
                    id:idd
                },
                data:{
                    nome: nome,
                    login: login,
                    senha:await bcrypt.hash(senha,10),
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }

    static async login(req:Request, res:Response){

        const { login,senha } : AdministradorProps= req.body;
    
        try{
          const Consumidor = await prisma.administrador.findMany({
            where:{
              login
            }
          });
    
          if(!Consumidor)
            return res.status(400).send({ error: "Usuário não encontrado"});
            
          if(!await bcrypt.compare(senha, Consumidor[0].senha))
            return res.status(400).send({ error: "Senha inválida"});
          
          return res.send(Consumidor);
        }catch(e){
          console.log(e);
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.code});
          }
          res.status(500).send(e);
    
        }
    
      }
    
}