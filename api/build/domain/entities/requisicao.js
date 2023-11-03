"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requisicao = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const geoip_lite_1 = require("geoip-lite");
const prisma = new client_1.PrismaClient();
class Requisicao extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async create(req, res) {
        const props = req.body;
        try {
            var geo = (0, geoip_lite_1.lookup)(props.ip) || { country: 'BR2', region: 'PR@' };
            await prisma.requisicao.create({
                data: {
                    ip: props.ip,
                    uf: geo.country + '/' + geo.region,
                    data: new Date(),
                    verificacao: props.verificacao
                }
            });
            res.send(200);
        }
        catch (error) {
            res.json({
                code: 500,
                error: error
            });
        }
    }
    static async listOrderByIdDesc(req, res) {
        try {
            const itens_per_page = 10;
            const pg = +req.body.page;
            const response = await prisma.requisicao.findMany({
                skip: (pg - 1) * itens_per_page,
                take: itens_per_page,
                orderBy: [
                    {
                        id: 'desc'
                    }
                ]
            });
            res.send({
                qtd: await prisma.requisicao.count(),
                data: response
            });
        }
        catch (error) {
        }
    }
    static async serchOrderByIdDesc(req, res) {
        try {
            const itens_per_page = 10;
            const pg = +req.body.page;
            const response = await prisma.requisicao.findMany({
                skip: (pg - 1) * itens_per_page,
                take: itens_per_page,
                orderBy: [
                    {
                        id: 'desc'
                    }
                ],
                where: {
                    uf: req.body.uf
                }
            });
            res.send({
                qtd: await prisma.requisicao.count({ where: { uf: req.body.uf } }),
                data: response
            });
        }
        catch (error) {
        }
    }
}
exports.Requisicao = Requisicao;
