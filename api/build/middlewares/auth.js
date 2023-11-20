"use strict";
// import { NextFunction,Request,Response } from "express";
// import {verify} from 'jsonwebtoken';
// // const jwt = require('jsonwebtoken');
// const authConfig = require('../config/auth.json');
// import {Token} from '../domain/entities/token';
// // const tokenManager = require('../controllers/TokenManager');
// export function auth(req:Request,res:Response,next:NextFunction) {
//     const authHeader = req.headers.authorization;
//     // console.log(req.headers);
//     if(!authHeader)
//         return res.status(401).send({ error: 'No token provided'});
//     const parts = authHeader.split(' ');
//     if(!parts.length === 2)
//         return res.status(401).send({ error:'Token error'});
//     const [scheme, token] = parts;
//     // console.log(scheme);
//     if(scheme != 'Bearer')
//     return res.status(401).send({ error:'Token malformatted'});
//     jwt.verify(token, authConfig.secret, (err:any,decoded:any) => {
//         if(err) {
//             const results = await Token.carregarPorToken(token)
//                 if(results == null){
//                     return res.status(401).send({ error:'Token invalid'});
//                 }else{
//                     console.log('Token valido')
//                     // if(results.token == token){
//                     //     // console.log('novo token');
//                     //     // return res.status(401).send({ error:'Token expired'});
//                     //     const token = jwt.sign({ id: results.id}, authConfig.secret,{
//                     //         expiresIn: 86400
//                     //     });
//                     //     tokenManager.alterar(
//                     //         results.id,
//                     //         token,
//                     //         res,
//                     //         next
//                     //         );
//                     //     return res.json({newToken: token});
//                     // }else{
//                     //     // console.log(results.token)
//                     //     return res.status(401).send({ error:'Token invalid'});
//                     // }
//                 }
//         }else{
//             return next();
//         }
//         // req.use
//     });
// }
