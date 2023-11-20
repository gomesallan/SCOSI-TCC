"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrador = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const usuario_1 = require("./usuario");
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new client_1.PrismaClient();
class Administrador extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async cadastrar(req, res) {
        const { nome, data_cadastro, usuario } = req.body;
        try {
            usuario.tipo = "Administrador";
            const usuarionovo = await usuario_1.Usuario.cadastrar(usuario, res);
            await prisma.administrador.create({
                data: {
                    nome: nome,
                    data_cadastro: new Date(),
                    usuario_id: usuarionovo.id
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
    static async buscarPorId(id) {
        const usuario = await prisma.usuario.findFirst({
            where: {
                id
            }
        });
        return usuario;
    }
    static async alterar(req, res) {
        var _a;
        const { id } = req.params;
        var idd = +id;
        const { nome, usuario } = req.body;
        try {
            const administrador = await prisma.administrador.update({
                where: {
                    id: idd
                },
                data: {
                    nome: nome
                }
            });
            const usuariodb = await usuario_1.Usuario.buscarPorId(administrador.usuario_id);
            usuario.id = administrador.usuario_id;
            if (!usuario.senha) {
                usuario.senha = (_a = usuariodb === null || usuariodb === void 0 ? void 0 : usuariodb.senha) !== null && _a !== void 0 ? _a : await bcrypt.hash(usuario.senha, 10);
            }
            else {
                usuario.senha = await bcrypt.hash(usuario.senha, 10);
            }
            await usuario_1.Usuario.alterar(usuario, res);
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
