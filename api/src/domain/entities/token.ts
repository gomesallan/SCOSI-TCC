import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient,Prisma } from '@prisma/client'
import { UsuarioProps } from './usuario';
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient()

export type TokenProps = {
    id:number;
    data_cadastro?:Date;
    token:string;
    ativo:number;
    usuario:UsuarioProps;
};

export class Token extends Entity<TokenProps> {
    private constructor(props: TokenProps, id?: string){
        super(props,id);
    }

    static async cadastro(tokenProps:TokenProps){

        const { token,usuario } : TokenProps= tokenProps;

        try{
            await prisma.token.create({
                data:{
                    data_cadastro:new Date(),
                    data_alteracao:new Date(),
                    token: token,
                    usuario_id:usuario.id
                    
                }
            });

            return 200;
        }catch(e){
          console.log(e);
      }
    }
    static async alterar(tokenProps:TokenProps){
        
        const { id,token } : TokenProps= tokenProps;
        
        try{
            await prisma.token.update({
                where:{
                    id:id
                },
                data:{
                    token: token,
                    data_alteracao:new Date(),
                }
            });

            return 200;
        }catch(e){
            console.log(e);
      }
    }

    static async buscarPorUsuario(usuario:number){
    
        try{
          const tokendb = await prisma.token.findFirst({
            include:{
              usuario:true
            },
            where:{
              usuario_id:usuario
            }
          }); 
          
          return tokendb;
        }catch(e){
          console.log(e);
    
        }
    
      }
    static async carregarPorToken(token:String){
    
        try{
          const tokendb = await prisma.token.findFirst({
            include:{
              usuario:true
            },
            where:{
              token:token
            }
          }); 
          
          return tokendb;
        }catch(e){
          console.log(e);
    
        }
    
      }
    
}