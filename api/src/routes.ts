import  express, { NextFunction, response } from 'express';
const routes = express.Router(); 
const fs = require("fs");
const path = require('path');
import "express-async-errors";


// const authMiddleware = require('./middlewares/auth') 

import {Produto} from './domain/entities/produto';
// import {FileExport} from './domain/entities/fileexport';
// import {Ordens} from './domain/entities/ordens';
import { Administrador } from './domain/entities/administardor';
import { Usuario } from './domain/entities/usuario';
import { authAdministrador } from './middlewares/authAdministrador';
import { Etiqueta } from './domain/entities/etiqueta';
import { Parceiro } from './domain/entities/parceiro';

var prefix = '';

prefix = '/usuario';
routes.post(`${prefix}/login`, Usuario.login);

prefix = '/administrador';
routes.post(`${prefix}/cadastrar`, Administrador.cadastrar);
routes.put(`${prefix}/alterar/:id`, Administrador.alterar);

prefix = '/produto';
routes.post(`${prefix}/cadastrar`,authAdministrador,Produto.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Produto.alterar);
routes.get(`${prefix}/buscar-por-cod`,authAdministrador,Produto.buscarPorCod);
routes.get(`${prefix}/buscar-ativo-por-cod`,authAdministrador,Produto.buscarAtivoPorCod);

prefix = '/etiqueta';
routes.post(`${prefix}/cadastrar`,authAdministrador,Etiqueta.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Etiqueta.alterar);
routes.get(`${prefix}/buscar-por-referencia`,authAdministrador,Etiqueta.buscarPorReferencia);
routes.get(`${prefix}/buscar-ativo-por-referencia/:referencia`,authAdministrador,Etiqueta.buscarAtivosPorReferencia);

prefix = '/parceiro';
routes.post(`${prefix}/cadastrar`,authAdministrador,Parceiro.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Parceiro.alterar);
routes.get(`${prefix}/buscar-ativo-por-nome/:nome`,authAdministrador,Parceiro.buscarAtivoPorNome);
routes.get(`${prefix}/buscar-por-nome`,authAdministrador,Parceiro.buscarPorNome);

// prefix = '/file';
// routes.get(`${prefix}/generate/:cod/:lote/:etiqueta/:qtd`, FileExport.file2);
// routes.post(`${prefix}/get`, FileExport.readProducts);

// prefix = '/production';
// routes.get(`${prefix}/listOrder`, Ordens.listOrdens);
// routes.delete(`${prefix}/delete`, Ordens.delete);


module.exports = routes    