"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const Entity_1 = require("../../core/domain/Entity");
const client_1 = require("@prisma/client");
const authConfig = require('../../config/auth.json');
const jwt = require('jsonwebtoken');
const prisma = new client_1.PrismaClient();
class Login extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async login(req, res) {
        const { cod } = req.body;
        if (cod === "@bgraf1298") {
            const token = jwt.sign({ id: "@bgraf1298" }, authConfig.secret, {});
            await prisma.token.create({
                data: {
                    token: token,
                    usuario: "BGRAF",
                    data: new Date()
                }
            });
            res.json({
                code: 200,
                token: token
            });
        }
        else {
            res.json({
                code: 401,
                error: "Login e/ou senha incorretos"
            });
        }
    }
}
exports.Login = Login;
