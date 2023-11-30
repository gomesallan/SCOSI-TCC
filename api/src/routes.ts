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
import { Ordem } from './domain/entities/ordem';
import { authGeral } from './middlewares/authGeral';
import { Arquivo } from './domain/entities/arquivo';

var prefix = '';

prefix = '/usuario';
routes.post(`${prefix}/login`, Usuario.login);
routes.post(`${prefix}/token`, authGeral,Usuario.carregarPorToken);

prefix = '/administrador';
routes.post(`${prefix}/cadastrar`, Administrador.cadastrar);
routes.put(`${prefix}/alterar/:id`, Administrador.alterar);

prefix = '/produto';
routes.post(`${prefix}/cadastrar`,authAdministrador,Produto.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Produto.alterar);
routes.get(`${prefix}/listar-todos`,authAdministrador,Produto.listarTodos);
routes.get(`${prefix}/listar-ativos`,authAdministrador,Produto.listarAtivos);

prefix = '/etiqueta';
routes.post(`${prefix}/cadastrar`,authAdministrador,Etiqueta.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Etiqueta.alterar);
routes.get(`${prefix}/listar-todos`,authAdministrador,Etiqueta.listarTodos);
routes.get(`${prefix}/listar-ativos`,authAdministrador,Etiqueta.listarAtivos);
routes.get(`${prefix}/buscar-ativo-por-referencia/:referencia`,authAdministrador,Etiqueta.buscarAtivosPorReferencia);

prefix = '/parceiro';
routes.post(`${prefix}/cadastrar`,authAdministrador,Parceiro.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Parceiro.alterar);
routes.get(`${prefix}/buscar-ativo-por-nome/:nome`,authAdministrador,Parceiro.buscarAtivoPorNome);
routes.get(`${prefix}/listar-todos`,authAdministrador,Parceiro.listarTodos);
routes.get(`${prefix}/listar-ativos`,authAdministrador,Parceiro.listarAtivos);

prefix = '/ordem';
routes.post(`${prefix}/cadastrar`,authAdministrador,Ordem.cadastrar);
routes.put(`${prefix}/alterar/:id`,authAdministrador,Ordem.alterar);
routes.put(`${prefix}/alterar-status/:id`,authGeral, Ordem.alterarStatus);
routes.delete(`${prefix}/excluir/:id`,authAdministrador, Ordem.excluir);
routes.get(`${prefix}/listar-por-status/:status`,authAdministrador, Ordem.listarPorStatus);
routes.get(`${prefix}/listar-por-status-e-parceiro/:parceiro/:status`,authGeral, Ordem.listarPorStatusEParceiro);

prefix = '/arquivo';
routes.get(`${prefix}/gerar/:ordem_id`, Arquivo.gerarArquivo);


module.exports = routes    