"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const token_1 = require("./token");
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new client_1.PrismaClient();
class Usuario extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async cadastrar(usuario, res) {
        const { login, senha, tipo } = usuario;
        const usuariodb = await prisma.usuario.create({
            data: {
                data_cadastro: new Date(),
                login: login,
                senha: await bcrypt.hash(senha, 10),
                tipo: tipo
            }
        });
        return usuariodb;
    }
    static async alterar(usuario, res) {
        const { id, login, senha } = usuario;
        try {
            const usuariodb = await prisma.usuario.update({
                where: {
                    id: id
                },
                data: {
                    login: login,
                    senha: senha
                }
            });
            return 200;
        }
        catch (e) {
            console.log(e);
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
    static async login(req, res) {
        const { login, senha } = req.body;
        try {
            const usuario = await prisma.usuario.findFirst({
                where: {
                    login
                }
            });
            if (!usuario)
                return res.status(400).send({ error: "Usuário não encontrado" });
            if (!await bcrypt.compare(senha, usuario.senha))
                return res.status(400).send({ error: "Senha inválida" });
            const token = jwt.sign({ id: usuario.id }, authConfig.secret, {});
            usuario.senha = "";
            const tokenProps = req.body;
            tokenProps.token = token;
            tokenProps.usuario = usuario;
            await Usuario.verificaToken(tokenProps);
            return res.send({ usuario: usuario, token: token });
        }
        catch (e) {
            console.log(e);
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                res.status(500).send({ errorCode: e.code });
            }
            res.status(500).send(e);
        }
    }
    static async verificaToken(tokenProps) {
        const tkprops = tokenProps;
        const tokendb = await token_1.Token.buscarPorUsuario(tkprops.usuario.id);
        if (!tokendb) {
            await token_1.Token.cadastro(tkprops);
        }
        else {
            tkprops.id = tokendb.id;
            await token_1.Token.alterar(tkprops);
        }
    }
}
exports.Usuario = Usuario;
