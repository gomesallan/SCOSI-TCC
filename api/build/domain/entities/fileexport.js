"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExport = void 0;
const Entity_1 = require("../../core/domain/Entity");
const fastcsv = require("fast-csv");
const fs = require("fs");
const client_1 = require("@prisma/client");
const ean_1 = require("./ean");
const prisma = new client_1.PrismaClient();
class FileExport extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static async file(req, res) {
        const { cod, lote, etiqueta } = req.params;
        console.log(cod, lote);
        const nserie = await prisma.produto_acabado.findMany({
            where: {
                cod_produto: +cod,
                lote: +lote
            },
            select: {
                nserie: true
            }
        });
        console.log(nserie);
        if (!nserie)
            return res.status(400).send({ error: "Produto ou lote inválido." });
        const file = 'data/' + etiqueta + '-' + cod + '-' + lote + ".csv";
        const ws = fs.createWriteStream(file);
        await fastcsv
            .write(nserie, { headers: true })
            .on("finish", function () {
            console.log("Write to CSV successfully!");
        })
            .pipe(ws);
        setTimeout(function () {
            return res.download(file);
        }, 5000);
    }
    static async file2(req, res) {
        const eanProps = {
            cod_produto: req.params.cod,
            lote: parseInt(req.params.lote),
            qtd: parseInt(req.params.qtd),
            etiqueta: req.params.etiqueta,
            comex: 0
        };
        console.log(eanProps);
        // const orndem: any = await prisma.ordens.findFirst({where:{cod_produto:parseInt(eanProps.cod_produto),lote:eanProps.lote}});
        // if(orndem)
        //     return res.status(400).send({error:"Lote já cadastrada para este produto!"}); 
        // const produto: any = await prisma.protudo.findFirst({where:{cod:''+eanProps.cod_produto}});
        // if(!produto)
        //     return res.status(400).send({error: "Produto não cadastrado!"});
        var nserie = ean_1.Ean.unifyParams(eanProps);
        console.log(nserie);
        if (!nserie)
            return res.status(400).send({ error: "Produto ou lote inválido." });
        const file = 'data/' + eanProps.etiqueta + '-' + eanProps.cod_produto + '-' + eanProps.lote + ".csv";
        const ws = fs.createWriteStream(file);
        await fastcsv
            .write(nserie, { headers: true })
            .on("finish", function () {
            console.log("Write to CSV successfully!");
        })
            .pipe(ws);
        setTimeout(function () {
            return res.download(file, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(file, function () {
                    console.log("File was deleted");
                });
            });
        }, 5000);
    }
    static async readProducts(req, res) {
        var dataArr = [];
        await fastcsv.parseFile("ProdutosMeuLizze.csv", { headers: false })
            .on("data", function (data) {
            dataArr.push(data);
            // console.log(data);
            data.forEach(async function (element) {
                // console.log(element.split(';')[0]);
                // await prisma.protudo.create({
                //     data:{
                //         nome: element.split(';')[1],
                //         img: 'url',
                //         cod: element.split(';')[3],
                //         data:new Date()
                //     }
                // });
            });
        })
            .on("end", () => {
            console.log(dataArr.length);
            // > 4187
        });
        // console.log(dataArr);
        return res.send(dataArr);
    }
}
exports.FileExport = FileExport;
