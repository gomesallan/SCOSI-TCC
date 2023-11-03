import { Entity } from '../../core/domain/Entity';
import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client'
import {Ean} from './ean';
import {EanProps} from './ean';
import crypto from 'crypto';

const prisma = new PrismaClient();

type ProdutoAcabadoProps = {
    produto: number;
    nserie: string;
    lote:number;
    cod_produto:number;
    hash: string;
    etiqueta?: string;
    data?: Date;   
    qtd:number; 
    comex:number;
};

export class ProdutoAcabado extends Entity<ProdutoAcabadoProps> {
    private constructor(props: ProdutoAcabadoProps, id?: string){
        super(props,id);
    }

    static async create(req:Request,res:Response, ){ 

        const { 
            produto,
            lote,
            nserie,
            cod_produto,
            hash,
            etiqueta
         } : ProdutoAcabadoProps= req.body;

        await prisma.produto_acabado.create({
            data:{
                lote:lote,
                nserie: nserie,
                hash: hash,
                protudo: produto, 
                cod_produto: cod_produto, 
                data:new Date(),
                etiqueta:''+etiqueta
            }
        });

        return res.send(200);
    }
    public static async createMultiple(req:Request,res:Response, nserie:string,lote:number){
        try{
            const array = []; 
            const { 
                produto,
                cod_produto,
                etiqueta,
                qtd,
                comex
            } : ProdutoAcabadoProps= req.body;

            var qtdd:number = +qtd;
            var codd:number = +cod_produto;
            var comex2:number = +comex;
            const {id}: any = await prisma.protudo.findFirst({where:{cod:''+cod_produto}});

            if(!id)
                return res.status(400).send({error: "Produto não cadastrado!"});
            
            const prod_aca = await prisma.produto_acabado.create({
                data:{
                    nserie: nserie,
                    hash: crypto.createHash('sha512').update(new Date().getUTCMilliseconds()+nserie).digest('hex'),
                    protudo: id, 
                    lote:lote,
                    cod_produto:codd,
                    data:new Date(),
                    etiqueta:''+etiqueta,
                    qtd:qtdd, 
                    comex:comex2
                }
            });

            return prod_aca;
        }
        catch (e){
            console.log({
                code:500,
                error:e
            });
            res.status(500).send({error:'Erro ao inserir Produto Acabado'})
            // res.json({
            //     code:500,
            //     error:e
            // });
        }
            
        // return res.send(200);
    }
    static async update(req:Request,res:Response){
        
        const {id} = req.params;
        var idd:number = +id; 
        const { 
            produto,
            nserie,
            hash,
         } : ProdutoAcabadoProps= req.body;
        
        await prisma.produto_acabado.update({
            where:{
                id:idd
            },
            data:{
                hash: hash,
                protudo: produto,
                nserie: nserie,
            }
        });

        return res.send(200);
    }
    

    static async firstPerHash(req:Request,res:Response){

        const {hash} = req.params;

        const allUsers = await prisma.produto_acabado.findFirst({
            where:{
                hash
            }
        })
        console.log(allUsers)
        return res.send(allUsers)
    }
    static async firstPerNSerie(req:Request,res:Response){

        const {nserie} = req.body;

        const allUsers = await prisma.produto_acabado.findFirst({
            where:{
                nserie
            }
        })
        console.log(allUsers)
        return res.send(allUsers)
    }

    static async listPerLote(req:Request,res:Response){
        const {lote,produto} = req.params; 
        var lote2:number = +lote;
        var cod:number = +produto;
        try{

            const list =  await prisma.produto_acabado.findMany({
                where:{
                    lote:lote2,
                    cod_produto:cod 
                }
            })
            return res.send(list);
        }catch(e){
            res.status(500).send({
                error:e 
            });
        }

    }

    static async ean(req: Request,res: Response){
        try{
            const eanProps : EanProps = req.body; 
            var cod:number = +eanProps.cod_produto;
            var lote:number = +eanProps.lote;
            var comex:number = +eanProps.comex;
            var qtd:number = +eanProps.qtd;
            const produtoacabado: any = await prisma.ordens.findFirst({where:{cod_produto:cod,lote:lote}});
            if(produtoacabado)
                return res.status(400).send({error:"Lote já cadastrada para este produto!"}); 
            const produto: any = await prisma.protudo.findFirst({where:{cod:''+cod}});
            if(!produto)
                return res.status(400).send({error: "Produto não cadastrado!"});

            try{
                await prisma.ordens.create({
                    data:{
                        cod_produto:cod,
                        data_cadastro:new Date(),
                        produto: produto.nome+"",
                        lote:lote,
                        qtd:qtd,
                        comex: produto.comex,
                        comex2: comex,
                        etiqueta: comex?eanProps.etiqueta:produto.comex?eanProps.etiqueta:produto.etiqueta
                    }
                })

                return res.json({code:200, data: ''});
            }catch(e){
                console.log(e)
                res.status(500).send({
                    error:e 
                });
            }
        }catch(e){
            res.status(500).send({
                error:e 
            });
        }
    }
    // static async ean(req: Request,res: Response){
    //     const eanProps : EanProps = req.body; 
    //     var cod:number = +eanProps.cod_produto;
    //     var lote:number = +eanProps.lote;
    //     const produtoacabado: any = await prisma.produto_acabado.findFirst({where:{cod_produto:cod,lote:lote}});
    //     if(produtoacabado)
    //         return res.status(400).send({error:"Lote já cadastrada para este produto!"}); 
    //     const produto: any = await prisma.protudo.findFirst({where:{cod:''+cod}});
    //     if(!produto)
    //         return res.status(400).send({error: "Produto não cadastrado!"});
    //     var array = Ean.unifyParams(eanProps);
    //     const arra: Array<any> = [];
    //     for (const element of array)  {
    //         try{
    //             const ret = await ProdutoAcabado.createMultiple(
    //                 req,
    //                 res,
    //                 element,
    //                 lote,
    //                 )

    //             arra.push(ret);    
    //         }catch(e){
    //             res.json({
    //                 code:500,
    //                 error:e
    //             });
    //         }
    //     }
    //     // console.log(arra);
    //     return res.json({code:200, data: arra});
        
    // }
    
}