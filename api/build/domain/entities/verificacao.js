"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verificacao = void 0;
const client_1 = require("@prisma/client");
const Entity_1 = require("../../core/domain/Entity");
const prisma = new client_1.PrismaClient();
class Verificacao extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async create(req, res) {
        const props = req.body;
        try {
            await prisma.verificacao.create({
                data: {
                    hash: props.hash,
                    valida: props.valida,
                    produto_acabado: props.produto_acabado,
                    data: new Date(),
                }
            });
            res.send(200);
        }
        catch (e) {
            res.json({
                code: 500,
                error: e
            });
        }
    }
    static async qtdVerificacao(req, res) {
        const props = req.body;
        try {
            const countverify = await prisma.verificacao.count({
                where: {
                    hash: props.hash
                }
            });
            var title = '';
            var msg = '';
            var color = '';
            if (countverify == 1) {
                title = 'Original Product';
                msg = 'Original Product';
                color = '#519839';
            }
            else if (countverify == 2) {
                title = 'Warning';
                msg = 'You may have been a victim of counterfeiting';
                color = '#ff9f1a';
            }
            else {
                title = 'Fake Product';
                msg = 'This product is FAKE!';
                color = '#e80042';
            }
            res.json({
                qtd: countverify,
                title: title,
                msg: msg,
                color: color
            });
        }
        catch (error) {
            res.json({
                code: 500,
                error: error
            });
        }
    }
}
exports.Verificacao = Verificacao;
