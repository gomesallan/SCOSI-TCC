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
