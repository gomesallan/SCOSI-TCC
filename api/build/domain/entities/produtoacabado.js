"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoAcabado = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
class ProdutoAcabado extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async create(req, res) {
        const { produto, lote, nserie, cod_produto, hash, etiqueta } = req.body;
        await prisma.produto_acabado.create({
            data: {
                lote: lote,
                nserie: nserie,
                hash: hash,
                protudo: produto,
                cod_produto: cod_produto,
                data: new Date(),
                etiqueta: '' + etiqueta
            }
        });
        return res.send(200);
    }
    static async createMultiple(req, res, nserie, lote) {
        try {
            const array = [];
            const { produto, cod_produto, etiqueta, qtd, comex } = req.body;
            var qtdd = +qtd;
            var codd = +cod_produto;
            var comex2 = +comex;
            const { id } = await prisma.protudo.findFirst({ where: { cod: '' + cod_produto } });
            if (!id)
                return res.status(400).send({ error: "Produto não cadastrado!" });
            const prod_aca = await prisma.produto_acabado.create({
                data: {
                    nserie: nserie,
                    hash: crypto_1.default.createHash('sha512').update(new Date().getUTCMilliseconds() + nserie).digest('hex'),
                    protudo: id,
                    lote: lote,
                    cod_produto: codd,
                    data: new Date(),
                    etiqueta: '' + etiqueta,
                    qtd: qtdd,
                    comex: comex2
                }
            });
            return prod_aca;
        }
        catch (e) {
            console.log({
                code: 500,
                error: e
            });
            res.status(500).send({ error: 'Erro ao inserir Produto Acabado' });
            // res.json({
            //     code:500,
            //     error:e
            // });
        }
        // return res.send(200);
    }
    static async update(req, res) {
        const { id } = req.params;
        var idd = +id;
        const { produto, nserie, hash, } = req.body;
        await prisma.produto_acabado.update({
            where: {
                id: idd
            },
            data: {
                hash: hash,
                protudo: produto,
                nserie: nserie,
            }
        });
        return res.send(200);
    }
    static async firstPerHash(req, res) {
        const { hash } = req.params;
        const allUsers = await prisma.produto_acabado.findFirst({
            where: {
                hash
            }
        });
        console.log(allUsers);
        return res.send(allUsers);
    }
    static async firstPerNSerie(req, res) {
        const { nserie } = req.body;
        const allUsers = await prisma.produto_acabado.findFirst({
            where: {
                nserie
            }
        });
        console.log(allUsers);
        return res.send(allUsers);
    }
    static async listPerLote(req, res) {
        const { lote, produto } = req.params;
        var lote2 = +lote;
        var cod = +produto;
        try {
            const list = await prisma.produto_acabado.findMany({
                where: {
                    lote: lote2,
                    cod_produto: cod
                }
            });
            return res.send(list);
        }
        catch (e) {
            res.status(500).send({
                error: e
            });
        }
    }
    static async ean(req, res) {
        try {
            const eanProps = req.body;
            var cod = +eanProps.cod_produto;
            var lote = +eanProps.lote;
            var comex = +eanProps.comex;
            var qtd = +eanProps.qtd;
            const produtoacabado = await prisma.ordens.findFirst({ where: { cod_produto: cod, lote: lote } });
            if (produtoacabado)
                return res.status(400).send({ error: "Lote já cadastrada para este produto!" });
            const produto = await prisma.protudo.findFirst({ where: { cod: '' + cod } });
            if (!produto)
                return res.status(400).send({ error: "Produto não cadastrado!" });
            try {
                await prisma.ordens.create({
                    data: {
                        cod_produto: cod,
                        data_cadastro: new Date(),
                        produto: produto.nome + "",
                        lote: lote,
                        qtd: qtd,
                        comex: produto.comex,
                        comex2: comex,
                        etiqueta: comex ? eanProps.etiqueta : produto.comex ? eanProps.etiqueta : produto.etiqueta
                    }
                });
                return res.json({ code: 200, data: '' });
            }
            catch (e) {
                console.log(e);
                res.status(500).send({
                    error: e
                });
            }
        }
        catch (e) {
            res.status(500).send({
                error: e
            });
        }
    }
}
exports.ProdutoAcabado = ProdutoAcabado;
