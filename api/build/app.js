"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes = require('./routes');
class App {
    constructor() {
        this.express = (0, express_1.default)();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.express.use(express_1.default.json());
        this.express.use((0, cors_1.default)());
        this.express.use('/api/v1', routes);
    }
    routes() {
        this.express.use((error, req, res, next) => {
            res.status(error.status || 500);
            res.json({
                code: error.code,
                error: error.message
            });
        });
        // // this.express.get('/',(req,res) => {
        // //   return res.send('Teste'); 
        // });
    }
}
exports.default = new App().express;
