import { NextFunction,Request,Response } from "express";
import {verify,sign} from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
import {Token} from '../domain/entities/token';
// const tokenManager = require('../controllers/TokenManager');


export async function authAdministrador(req:Request,res:Response,next:NextFunction) {

    const authHeader = req.headers.authorization;

    // console.log(req.headers);

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided'});

    const parts = authHeader.split(' ');
        
    const [scheme, token] = parts;
        
    if(scheme != 'Bearer')
    return res.status(401).send({ error:'Token malformatted'});
    
    try {
        verify(token, authConfig.secret);
        return next();
    } catch (error) {
        const results = await Token.carregarPorToken(token)
        
            if(results == null){
                return res.status(401).send({ error:'Token invalid'});
                
            }else{
                if(results.token == token){
                    // console.log('novo token');
                    // return res.status(401).send({ error:'Token expired'});
                    const token = sign({ id: results.id}, authConfig.secret,{
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