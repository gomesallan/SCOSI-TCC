"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etiqueta = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Etiqueta extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async cadastrar(req, res) {
        const { referencia, url } = req.body;
        try {
            await prisma.etiqueta.create({
                data: {
                    referencia: referencia,
                    data_cadastro: new Date(),
                    url: url
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
        const { referencia, url } = req.body;
        try {
            await prisma.etiqueta.update({
                where: {
                    id: idd
                },
                data: {
                    referencia: referencia,
                    url: url
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
}
exports.Etiqueta = Etiqueta;
