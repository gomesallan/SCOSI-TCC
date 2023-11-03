"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
const pdf = require('html-pdf');
const fs = require("fs");
const path = require('path');
const produto_1 = require("./domain/entities/produto");
const produtoacabado_1 = require("./domain/entities/produtoacabado");
const requisicao_1 = require("./domain/entities/requisicao");
const verificacao_1 = require("./domain/entities/verificacao");
const fileexport_1 = require("./domain/entities/fileexport");
const production_1 = require("./domain/entities/production");
const login_1 = require("./domain/entities/login");
var prefix = '';
prefix = '/product';
routes.post(`${prefix}/create`, produto_1.Produto.create);
routes.get(`${prefix}/first-per-cod/:cod`, produto_1.Produto.firstPerCod);
routes.put(`${prefix}/update/:id`, produto_1.Produto.update);
routes.put(`${prefix}/active/:id`, produto_1.Produto.active);
prefix = '/finished_product';
routes.post(`${prefix}/create`, produtoacabado_1.ProdutoAcabado.create);
routes.put(`${prefix}/update/:id`, produtoacabado_1.ProdutoAcabado.update);
routes.post(`${prefix}/first-per-hash/`, produtoacabado_1.ProdutoAcabado.firstPerHash);
routes.get(`${prefix}/first-per-nserie/:nserie`, produtoacabado_1.ProdutoAcabado.firstPerNSerie);
routes.post(`${prefix}/ean13`, produtoacabado_1.ProdutoAcabado.ean);
routes.get(`${prefix}/list-per-lote/:lote,:produto`, produtoacabado_1.ProdutoAcabado.listPerLote);
prefix = '/verify';
routes.post(`${prefix}/create`, verificacao_1.Verificacao.create);
routes.post(`${prefix}/count`, verificacao_1.Verificacao.qtdVerificacao);
prefix = '/request';
routes.post(`${prefix}/create`, requisicao_1.Requisicao.create);
routes.get(`${prefix}/list`, requisicao_1.Requisicao.listOrderByIdDesc);
routes.get(`${prefix}/search`, requisicao_1.Requisicao.serchOrderByIdDesc);
prefix = '/file';
routes.get(`${prefix}/generate/:cod/:lote/:etiqueta/:qtd`, fileexport_1.FileExport.file2);
routes.post(`${prefix}/get`, fileexport_1.FileExport.readProducts);
prefix = '/production';
routes.get(`${prefix}/listOrder`, production_1.Production.listProductionOrder);
routes.delete(`${prefix}/delete`, production_1.Production.delete);
prefix = '/login';
routes.post(`${prefix}`, login_1.Login.login);
prefix = '/teste';
routes.get(`${prefix}`, (req, res) => {
    var html = fs.readFileSync("/Users/allangomes/Projetos/original-lizze/src/ticket.html", "utf8");
    var options = {
        height: "4.5cm",
        width: "18cm",
        border: "2mm"
    };
    var users = [
        {
            name: "Shyam",
            age: "21",
        },
        {
            name: "Navjot",
            age: "22",
        },
        {
            name: "Vitthal",
            age: "23",
        },
    ];
    var document = {
        html: html,
        data: {
            users: users,
        },
        path: "./output.pdf",
        type: "",
    };
    pdf
        .create(html, options)
        .toFile('./out.pdf', (err, res) => {
        if (err)
            return console.log(err);
        console.log(res);
    });
    res.send('teste 519');
});
module.exports = routes;
