"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrador = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new client_1.PrismaClient();
class Administrador extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async cadastro(req, res) {
        const { nome, data_cadastro, login, senha } = req.body;
        try {
            await prisma.administrador.create({
                data: {
                    nome: nome,
                    data_cadastro: new Date(),
                    login: login,
                    senha: await bcrypt.hash(senha, 10),
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
exports.Administrador = Administrador;
