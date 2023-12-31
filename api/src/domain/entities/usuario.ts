import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma, usuario_tipo } from '@prisma/client'
import { Token, TokenProps } from './token';
import Auth from '../../config/auth';
// import { Auth } from '../../config/auth';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient()

export type UsuarioProps = {
    id:number;
    data_cadastro?:Date;
    login:string;
    senha:string;
    tipo: usuario_tipo;
};

export class Usuario extends Entity<UsuarioProps> {
    private constructor(props: UsuarioProps, id?: string){
        super(props,id);
    }

    static async cadastrar(usuario:UsuarioProps,res:Response){

        const { login,senha,tipo } : UsuarioProps= usuario;
        
        const usuariodb = await prisma.usuario.create({
            data:{
                data_cadastro:new Date(),
                login: login,
                senha:await bcrypt.hash(senha,10),
                tipo:tipo
            }
        });

        return usuariodb;
    }
    static async alterar(usuario:any,res:Response){
        const { id,login,senha } : UsuarioProps= usuario;
        try{ 
          const usuariodb = await prisma.usuario.update({
              where:{
                    id:id
              },
              data:{
                  login: login,
                  senha:senha
              }
          });

          return 200;
        }catch(e){
          console.log(e);
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

    static async login(req:Request, res:Response){

        const { login,senha } : UsuarioProps= req.body;
    
        try{
          const usuario = await prisma.usuario.findFirst({
            where:{
              login
            }
          });
          if(!usuario)
            return res.status(400).send({ error: "Usuário não encontrado"});
            
          if(!await bcrypt.compare(senha, usuario.senha))
            return res.status(400).send({ error: "Senha inválida"});

            
            const token = jwt.sign({ id: usuario.id}, Auth.secret().secret,{expiresIn: "20d"});   
            usuario.senha = "";
            
            const tokenProps : TokenProps = req.body
            tokenProps.token = token;
            tokenProps.usuario = usuario;
            
            await Usuario.verificaToken(tokenProps);
            
            const user = await Usuario.verificaTipoUsuario(usuario.id,usuario.tipo)
            if(!user?.ativo)
                return res.status(400).send({ error: "Usuário bloqueado"});
            
          return res.send({usuario:user,token:token});
        }catch(e){
          console.log(e);
          if(e instanceof Prisma.PrismaClientKnownRequestError){
            res.status(500).send({errorCode:e.code});
          }
          res.status(500).send(e); 
    
        }
    
      }
      
    static async carregarPorToken(req:Request,res:Response){
        const {token}:any = req.body;
        try{
          const tokendb = await Token.carregarPorToken(token);
          if(!tokendb)
            return res.status(400).send({ error: "Token invalido"});
          const usuer = await Usuario.verificaTipoUsuario(tokendb.usuario_id,tokendb.usuario.tipo)
          return res.send(usuer);
        }catch(e){
          console.log(e);
          return res.status(500).send(e); 
        }
        
    }

    static async verificaTipoUsuario(usuario:number,tipo:string){
      if(tipo == 'Administrador'){
          const administrador = await prisma.administrador.findFirst({include:{usuario:true}, where:{usuario_id:usuario}});
          if(administrador)
          administrador.usuario.senha = "";
          return administrador;
      }else{
          const parceiro = await prisma.parceiro.findFirst({include:{usuario:true}, where:{usuario_id:usuario}});
          if(parceiro)
          parceiro.usuario.senha = "";
          return parceiro;
      }
    }

    static async verificaToken(tokenProps:TokenProps){
        const tkprops :TokenProps = tokenProps;
        const tokendb = await Token.buscarPorUsuario(tkprops.usuario.id)
        
        if(!tokendb){
          await Token.cadastro(tkprops);
        }else{
          tkprops.id = tokendb.id;
          await Token.alterar(tkprops);
        }
    }
      
    
}