import  express from 'express';
const routes = express.Router(); 
const fs = require("fs");
const path = require('path');

import {Produto} from './domain/entities/produto';
import {FileExport} from './domain/entities/fileexport';
import {Ordens} from './domain/entities/ordens';
import { Login } from './domain/entities/login';

var prefix = '';

prefix = '/product';
routes.post(`${prefix}/create`,Produto.create);
routes.get(`${prefix}/first-per-cod/:cod`,Produto.firstPerCod);
routes.put(`${prefix}/update/:id`,Produto.update);
routes.put(`${prefix}/active/:id`,Produto.active);

prefix = '/file';
routes.get(`${prefix}/generate/:cod/:lote/:etiqueta/:qtd`, FileExport.file2);
routes.post(`${prefix}/get`, FileExport.readProducts);

prefix = '/production';
routes.get(`${prefix}/listOrder`, Ordens.listOrdens);
routes.delete(`${prefix}/delete`, Ordens.delete);

prefix = '/login';
routes.post(`${prefix}`, Login.login);


module.exports = routes    