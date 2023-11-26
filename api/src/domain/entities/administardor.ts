import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'
import { Usuario, UsuarioProps } from './usuario';
// const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient()

export type AdministradorProps = {
    id:number;
    data_cadastro?:Date;
    nome:string;
    usuario: UsuarioProps;
    ativo:number
};

export class Administrador extends Entity<AdministradorProps> {
    private constructor(props: AdministradorProps, id?: string){
        super(props,id);
    }

    static async cadastrar(req:Request,res:Response){

        const { nome,data_cadastro,usuario } : AdministradorProps= req.body;

        
        try{

            usuario.tipo = "Administrador" 
            const usuarionovo : UsuarioProps = await Usuario.cadastrar(usuario,res);

            await prisma.administrador.create({
                data:{
                    nome: nome,
                    data_cadastro:new Date(),
                    usuario_id:usuarionovo.id
                }
            });

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }
    static async buscarPorId(id:number){
        const usuario = await prisma.usuario.findFirst({
          where:{
            id
          }
        });
  
        return usuario;
     
    }
    static async alterar(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        
        const { nome, usuario } : AdministradorProps= req.body;
        
        try{
            const administrador = await prisma.administrador.update({
                where:{
                    id:idd
                },
                data:{
                    nome: nome
                }
            });
            const usuariodb = await Usuario.buscarPorId(administrador.usuario_id)
            usuario.id = administrador.usuario_id;
            if(!usuario.senha){
                usuario.senha = usuariodb?.senha ?? await bcrypt.hash(usuario.senha,10)
            }else{
                usuario.senha = await bcrypt.hash(usuario.senha,10)
            }
            await Usuario.alterar(usuario,res)

            return res.send(200);
        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(500).send({errorCode:e.message})
            }
      }
    }

    
    
}