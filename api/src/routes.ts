import  express from 'express';
const routes = express.Router(); 
const pdf = require('html-pdf');
const fs = require("fs");
const path = require('path');

import {Produto} from './domain/entities/produto';
import {ProdutoAcabado} from './domain/entities/produtoacabado';
import { Requisicao } from './domain/entities/requisicao';
import {Verificacao} from './domain/entities/verificacao';
import {FileExport} from './domain/entities/fileexport';
import { Production } from './domain/entities/production';
import { Login } from './domain/entities/login';

var prefix = '';

prefix = '/product';
routes.post(`${prefix}/create`,Produto.create);
routes.get(`${prefix}/first-per-cod/:cod`,Produto.firstPerCod);
routes.put(`${prefix}/update/:id`,Produto.update);
routes.put(`${prefix}/active/:id`,Produto.active);

prefix = '/finished_product';
routes.post(`${prefix}/create`,ProdutoAcabado.create);
routes.put(`${prefix}/update/:id`,ProdutoAcabado.update);
routes.post(`${prefix}/first-per-hash/`,ProdutoAcabado.firstPerHash);
routes.get(`${prefix}/first-per-nserie/:nserie`,ProdutoAcabado.firstPerNSerie);
routes.post(`${prefix}/ean13`, ProdutoAcabado.ean);
routes.get(`${prefix}/list-per-lote/:lote,:produto`, ProdutoAcabado.listPerLote);

prefix = '/verify';
routes.post(`${prefix}/create`, Verificacao.create);
routes.post(`${prefix}/count`, Verificacao.qtdVerificacao);

prefix = '/request';
routes.post(`${prefix}/create`, Requisicao.create);
routes.get(`${prefix}/list`, Requisicao.listOrderByIdDesc);
routes.get(`${prefix}/search`, Requisicao.serchOrderByIdDesc);

prefix = '/file';
routes.get(`${prefix}/generate/:cod/:lote/:etiqueta/:qtd`, FileExport.file2);
routes.post(`${prefix}/get`, FileExport.readProducts);

prefix = '/production';
routes.get(`${prefix}/listOrder`, Production.listProductionOrder);
routes.delete(`${prefix}/delete`, Production.delete);

prefix = '/login';
routes.post(`${prefix}`, Login.login);

prefix = '/teste'
routes.get(`${prefix}`, (req,res) =>{
    var html = fs.readFileSync("/Users/allangomes/Projetos/original-lizze/src/ticket.html", "utf8");
    var options = {
        height: "4.5cm",
        width: "18cm",
        border:"2mm"
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
  .toFile('./out.pdf',(err:any,res:any) => {
      if(err) return console.log(err);
      console.log(res);
    })
    
    res.send('teste 519');
});


module.exports = routes    