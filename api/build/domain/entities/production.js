"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Production = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
var slug = require('slug');
const prisma = new client_1.PrismaClient();
class Production extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async listProductionOrder2(req, res) {
        const { cod_produto, lote } = req.body;
        // console.log(cod_produto,lote)
        const nserie = await prisma.produto_acabado.findMany({
            take: 30,
            distinct: ['cod_produto', 'lote'],
            orderBy: { id: 'desc' },
            select: {
                cod_produto: true,
                lote: true,
                data: true,
                nserie: true,
                etiqueta: true,
                qtd: true,
                comex: true,
                protudo_produto_acabadoToprotudo: true
            },
        });
        var arra = [];
        nserie.forEach(async (element) => {
            var array = {
                cod_produto: element.cod_produto,
                lote: element.lote,
                data: element.data,
                etiqueta: slug(element.etiqueta),
                qtd: element.qtd,
                produto: element.protudo_produto_acabadoToprotudo.nome,
                tipo: element.protudo_produto_acabadoToprotudo.etiqueta,
                comex: element.protudo_produto_acabadoToprotudo.comex,
                comex2: element.comex
            };
            var qtd = +(element.qtd + "");
            // await prisma.ordens.create({
            //     data:{
            //         cod_produto:element.cod_produto,
            //         lote:element.lote,
            //         data_cadastro: new Date(),
            //         qtd:qtd,
            //         produto:element.protudo_produto_acabadoToprotudo.nome+"",
            //         etiqueta:element.protudo_produto_acabadoToprotudo.comex?element.etiqueta+"":element.comex?element.etiqueta+"":element.protudo_produto_acabadoToprotudo.etiqueta+"",
            //         comex:element.protudo_produto_acabadoToprotudo.comex,
            //         comex2:element.comex 
            //     } 
            // });
            arra.push(array);
        });
        return res.send({ data: arra });
    }
    static async listProductionOrder(req, res) {
        const nserie = await prisma.ordens.findMany({
            take: 30,
            orderBy: { id: 'desc' }
        });
        return res.send({ data: nserie });
    }
    ;
    static async delete(req, res) {
        try {
            await prisma.ordens.delete({
                where: {
                    id: 1
                }
            });
            return res.json({ code: 200, data: '' });
        }
        catch (e) {
        }
    }
}
exports.Production = Production;
