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
    static async create(req, res) {
        const { nome, img, cod, comex, etiqueta } = req.body;
        await prisma.protudo.create({
            data: {
                nome: nome,
                img: img,
                cod: cod,
                data: new Date(),
                comex: comex,
                etiqueta: etiqueta,
            }
        });
        return res.send(200);
    }
    static async update(req, res) {
        const { id } = req.params;
        var idd = +id;
        const { nome, img, cod } = req.body;
        await prisma.protudo.update({
            where: {
                id: idd
            },
            data: {
                nome: nome,
                img: img,
                cod: cod,
            }
        });
        return res.send(200);
    }
    static async active(req, res) {
        const { id } = req.params;
        var idd = +id;
        const { ativo } = req.body;
        await prisma.protudo.update({
            where: {
                id: idd
            },
            data: {
                ativo: ativo
            }
        });
        return res.send(200);
    }
    static async firstPerCod(req, res) {
        const { cod } = req.params;
        try {
            const allUsers = await prisma.protudo.findFirst({
                where: {
                    cod
                }
            });
            console.log(allUsers);
            return res.send(allUsers);
        }
        catch (e) {
            // if (e instanceof Prisma.PrismaClientKnownRequestError) {
            //     res.status(500).send({errorCode:e.code})
            // }
        }
    }
}
exports.Produto = Produto;
