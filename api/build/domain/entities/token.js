"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new client_1.PrismaClient();
class Token extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async cadastro(tokenProps) {
        const { token, usuario } = tokenProps;
        try {
            await prisma.token.create({
                data: {
                    data_cadastro: new Date(),
                    token: token,
                    usuario_id: usuario.id
                }
            });
            return 200;
        }
        catch (e) {
            console.log(e);
        }
    }
    static async alterar(tokenProps) {
        const { id, token } = tokenProps;
        try {
            await prisma.token.update({
                where: {
                    id: id
                },
                data: {
                    token: token
                }
            });
            return 200;
        }
        catch (e) {
            console.log(e);
        }
    }
    static async buscarPorUsuario(usuario) {
        try {
            const tokendb = await prisma.token.findFirst({
                include: {
                    usuario: true
                },
                where: {
                    usuario_id: usuario
                }
            });
            return tokendb;
        }
        catch (e) {
            console.log(e);
        }
    }
    static async carregarPorToken(token) {
        try {
            const tokendb = await prisma.token.findFirst({
                include: {
                    usuario: true
                },
                where: {
                    token: token
                }
            });
            return tokendb;
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.Token = Token;
