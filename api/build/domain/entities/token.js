"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Token extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async create(req, res) {
        const { token, usuario } = req.body;
        await prisma.token.create({
            data: {
                token: token,
                usuario: usuario,
                data: new Date()
            }
        });
        return res.send(200);
    }
    static async update(req, res) {
        const { id } = req.params;
        var idd = +id;
        const { status } = req.body;
        await prisma.token.update({
            where: {
                id: idd
            },
            data: {
                status
            }
        });
        return res.send(200);
    }
    static async firstPerCod(req, res) {
        const { cod } = req.params;
        const allUsers = await prisma.protudo.findFirst({
            where: {
                cod
            }
        });
        console.log(allUsers);
        return res.send(allUsers);
    }
}
exports.Token = Token;
