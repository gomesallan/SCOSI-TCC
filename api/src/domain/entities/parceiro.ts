import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'
import { Usuario, UsuarioProps } from './usuario';
import { AdministradorProps } from './administardor';
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient()

export type ParceiroProps = {
    id:number;
    data_cadastro?:Date;
    nome:string;
    ativo?:number;
    administrador_id: number;
    usuario: UsuarioProps;
};

export class Parceiro extends Entity<ParceiroProps> {
    private constructor(props: ParceiroProps, id?: string){
        super(props,id);
    }

    static async cadastrar(req:Request,res:Response){

        const { nome,administrador_id,usuario } : ParceiroProps= req.body;

        
        try{

            usuario.tipo = "Parceiro" 
            const usuarionovo : UsuarioProps = await Usuario.cadastrar(usuario,res);

            await prisma.parceiro.create({
                data:{
                    nome: nome,
                    administrador_id: administrador_id,
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
    static async buscarAtivoPorNome(req:Request,res: Response){

        const {pg}:any = req.body;
        const {nome}:any = req.params;
        const codlike = `%${nome}%`; 
        console.log(nome);
        try{
          const produto = await prisma.$queryRaw(
            Prisma.sql`SELECT * FROM parceiro WHERE ativo = 1 AND nome LIKE ${codlike} LIMIT 20 OFFSET ${(pg - 1) * 20}`
          )
    
          return res.send(produto);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }
    static async buscarPorNome(req:Request,res: Response){

        const {nome,pg}:any = req.body;
        const codlike = `%${nome}%`; 
        console.log(nome);
        try{
          const produto = await prisma.$queryRaw(
            Prisma.sql`SELECT * FROM parceiro WHERE  nome LIKE ${codlike} LIMIT 20 OFFSET ${(pg - 1) * 20}`
          )
    
          return res.send(produto);
    
        }catch(e){
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.message})
          }
        }
    
      }
    static async alterar(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        
        const { nome, usuario } : ParceiroProps= req.body;
        
        try{
            const Parceiro = await prisma.parceiro.update({
                where:{
                    id:idd
                },
                data:{
                    nome: nome
                }
            });
            const usuariodb = await Usuario.buscarPorId(Parceiro.usuario_id)
            usuario.id = Parceiro.usuario_id;
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