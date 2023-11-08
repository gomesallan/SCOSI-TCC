"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Produto extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async cadastrar(req, res) {
        const { nome, cod, etiqueta_id } = req.body;
        try {
            await prisma.produto.create({
                data: {
                    nome: nome,
                    data_cadastro: new Date(),
                    cod: cod,
                    etiqueta_id: etiqueta_id,
                }
            });
            return res.send(200);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                res.status(500).send({ errorCode: e.message });
            }
        }
    }
    static async alterar(req, res) {
        const { id } = req.params;
        var idd = +id;
        const { nome, cod, etiqueta_id, ativo } = req.body;
        try {
            await prisma.produto.update({
                where: {
                    id: idd
                },
                data: {
                    nome: nome,
                    cod: cod,
                    ativo: ativo,
                    etiqueta_id: etiqueta_id,
                }
            });
            return res.send(200);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                res.status(500).send({ errorCode: e.message });
            }
        }
    }
    static async buscarPorCod(req, res) {
        const { cod, pg } = req.body;
        const codlike = `%${cod}%`;
        console.log(cod);
        try {
            const produto = await prisma.$queryRaw(client_1.Prisma.sql `SELECT * FROM produto WHERE cod LIKE ${codlike} LIMIT 20 OFFSET ${(pg - 1) * 20}`);
            return res.send(produto);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                res.status(500).send({ errorCode: e.message });
            }
        }
    }
    static async buscarAtivoPorCod(req, res) {
        const { cod, pg } = req.body;
        const codlike = `%${cod}%`;
        console.log(cod);
        try {
            const produto = await prisma.$queryRaw(client_1.Prisma.sql `SELECT * FROM produto WHERE ativo = 1 AND cod LIKE ${codlike} LIMIT 20 OFFSET ${(pg - 1) * 20}`);
            return res.send(produto);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                res.status(500).send({ errorCode: e.message });
            }
        }
    }
}
exports.Produto = Produto;
