import { NextFunction,Request,Response } from "express";
import {verify,sign} from 'jsonwebtoken';
import {Token} from '../domain/entities/token';
import Auth from "../config/auth";


export async function authGeral(req:Request,res:Response,next:NextFunction) {

    const authHeader = req.headers.authorization;

    // console.log(req.headers);

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided'});

    const parts = authHeader.split(' ');
        
    const [scheme, token] = parts;
        
    if(scheme != 'Bearer')
    return res.status(401).send({ error:'Token malformatted'});
    
    const results = await Token.carregarPorToken(token)
    try {
        verify(token, Auth.secret().secret);

        return next();
    } catch (error) {
        
            if(results == null){
                return res.status(401).send({ error:'Token invalid'});
                
            }else{
                if(results.token == token){
                    // console.log('novo token');
                    // return res.status(401).send({ error:'Token expired'});
                    const token = sign({ id: results.id}, Auth.secret().secret,{
                        expiresIn: "20d"
                    });
                    results.token = token; 
                    await Token.alterar(
                        results
                        );
                    return res.json({newToken: token});
                }else{
                    // console.log(results.token)
                    return res.status(401).send({ error:'Token invalid'});
                }
            }
        
    }
    
}