import  express from 'express';
const routes = express.Router(); 
const fs = require("fs");
const path = require('path');

import {Produto} from './domain/entities/produto';
// import {FileExport} from './domain/entities/fileexport';
// import {Ordens} from './domain/entities/ordens';
import { Administrador } from './domain/entities/administardor';

var prefix = '';

prefix = '/administrador';
routes.post(`${prefix}`, Administrador.cadastro);

prefix = '/product';
routes.post(`${prefix}/cadastar`,Produto.cadastrar);
routes.put(`${prefix}/alterar/:id`,Produto.alterar);
routes.get(`${prefix}/buscar-por-cod`,Produto.buscarPorCod);
routes.get(`${prefix}/buscar-ativo-por-cod`,Produto.buscarAtivoPorCod);

// prefix = '/file';
// routes.get(`${prefix}/generate/:cod/:lote/:etiqueta/:qtd`, FileExport.file2);
// routes.post(`${prefix}/get`, FileExport.readProducts);

// prefix = '/production';
// routes.get(`${prefix}/listOrder`, Ordens.listOrdens);
// routes.delete(`${prefix}/delete`, Ordens.delete);



module.exports = routes    