'use client'
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogAlertBase, DialogFormBase } from "./components/dialog";
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area"
import { Check, Pencil, Trash, RefreshCcw } from "lucide-react"
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Home() {
    const {usuario} = useContext(AuthContext)
    const tipo_usuario = usuario?.usuario.tipo;
    return (
      <div className="min-h-screen bg-slate-100 p-10">
          <div className=" grid grid-cols-2 ">
            <div className="">
                <h2 className="font-medium text-2xl ">Início</h2>
                <p className="text-slate-400">Página inicial responsável pelo controle das ordens de serviço</p>
            </div>
            <div className="flex justify-end">
                <div className="text-right mt-2">
                { usuario?.usuario.tipo == 'Administrador'? (  
                    <DialogFormBase 
                        btn={<Button>Nova Ordem de Serviço</Button>} 
                        titulo="Cadastrar Ordem" 
                        descricao="Preencha os campos abaixo para gerar uma nova Ordem de Serviço."
                        formulario={FormularioOrdem()}
                        
                    />):
                    null
                    }
                </div>
            </div>
          </div>
          
            <ScrollArea className="w-full py-10 whitespace-nowrap">
                <div className="flex flex-row">
                    <div className="w-96">
                        <h1 className="font-bold text-xl">Novas Ordens de Serviço</h1>
                        <CardOrdem
                            cor="border-l-blue-400"
                            tipo_usuario={tipo_usuario}
                            status="Nova"
                        />
                    </div>
                    <div className="w-96">
                        <h1 className="font-bold text-xl">Ordens com Defeito</h1>
                        <CardOrdem
                            cor="border-l-red-500"
                            tipo_usuario={tipo_usuario}
                            status="Defeito"
                        />
                    </div>
                    <div className="w-96">
                        <h1 className="font-bold text-xl">Urgências</h1>
                        <CardOrdem
                            cor="border-l-orange-400"
                            tipo_usuario={tipo_usuario}
                            status="Urgencia"
                        />
                    </div>
                    <div className="w-96">
                        <h1 className="font-bold text-xl">Em Andamento</h1>
                        <CardOrdem
                            cor="border-l-purple-400"
                            tipo_usuario={tipo_usuario}
                            status="Andamento"
                        />
                    </div>
                    <div className="w-96">
                        <h1 className="font-bold text-xl">Enviadas</h1>
                        <CardOrdem
                            cor="border-l-yellow-300"
                            tipo_usuario={tipo_usuario}
                            status="Enviado"
                        />
                    </div>
                    <div className="w-96">
                        <h1 className="font-bold text-xl">Concluídas</h1>
                        <CardOrdem
                            cor="border-l-green-400"
                            tipo_usuario={tipo_usuario}
                            status="Concluido"
                        />
                    </div>
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
      </div>  
    )
  }

  function FormularioOrdem(){
    return (
        <>
        <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Lote
              </Label>
              <Input
                id="lote"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Quantidade
              </Label>
              <Input
                id="qtd"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Produto
              </Label>
              <Input
                id="produto_id"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Parceiro
              </Label>
              <Input
                id="produto_id"
                defaultValue=""
                className="col-span-3"
              />
            </div>
        </>
    )
  }
   
  function CardOrdem({
    data,
    lote,
    produto,
    qtd,
    status,
    tipo_usuario,
    cor
  }:any){
    const classNameCard = `
        hover:shadow-lg 
        border-l-4 mr-4 p-5
        ${cor}
        mb-2
    `;
    const msgAlertaExcluir = `Deseja Realmete APAGAR a ordem de serviço do lote ${lote} do produto ${produto} ?`;
    const msgAlertaDefeito = `Deseja Realmete marcar esse lote como DEFEITUOSO?`;
    return (
        <>
            <ScrollArea className="py-10 h-[700px]">
                <Card className={classNameCard}>  
                {/* PARTE VISIVEL SOMENTE PARA "ADMIN" */}
                { (tipo_usuario == 'Administrador') && 
                (status == 'Urgencia' || 
                status == 'Nova' ) 
                ? (
                    <div className="flex mb-4">
                        <DialogFormBase 
                            btn={<Button className="mr-1 bg-yellow-500 hover:bg-yellow-600" size="icon"><Pencil size={18}/></Button>} 
                            titulo="Alterar Ordem" 
                            descricao="..."
                            formulario={FormularioOrdem()}/>
                        <DialogAlertBase 
                            btn={<Button variant="destructive" className="mr-1" size="icon"><Trash size={18}/></Button>} 
                            titulo="Atenção!" 
                            descricao={msgAlertaExcluir}/>
                        
                    </div>
                    )
                :
                    null
                }
                { tipo_usuario == 'Administrador' && 
                status == 'Enviado' 
                ? (
                    <div className="flex mb-4">
                        <DialogAlertBase 
                            btn={<Button variant="destructive" className="mr-1" size="sm"><RefreshCcw size={18} className="mr-2"/> Etiquetas com defeito</Button>} 
                            titulo="Atenção!" 
                            descricao={msgAlertaDefeito}/>
                        
                        <Button className="bg-green-500 hover:bg-green-700" size="sm"><Check size={18} className="mr-2"/> Concluir</Button>
                    </div>
                )
                :
                
                null
                }

                <BaseConteudoCard 
                    data={data}
                    lote={lote}
                    produto={produto}
                    qtd={qtd}

                />
                {/* PARTE VISIVEL SOMENTE PARA "PARCEIRO" */}
                { 
                (tipo_usuario == 'Parceiro') && 
                (status != 'Enviado' &&
                status != 'Concluido')
                ? (
                    <div className="grid grid-cols-2 mt-8">
                        <div className="flex">
                            <Button className="mr-1" variant="secondary"><small>Etiqueta</small></Button>
                        </div>
                        <div className="flex justify-end">
                            <Button className="bg-green-500 hover:bg-green-700"><small>Gerar .CSV</small></Button>

                        </div>
                    </div>
                )
                :
                
                null
                }
                
                </Card>
            </ScrollArea>
        </>
    )
  }

  function BaseConteudoCard({
    data,
    lote,
    produto,
    qtd
  }:any){
    return (
        <>
            <div className="grid grid-cols-2">
                <small className="text-slate-400 ">DATA ALTERAÇÃO : </small>
                <div className="flex justify-end">
                    <small className="text-slate-400 ">{data}</small>
                </div>
            </div>
            <div className="grid grid-cols-4 mt-2">
                <div>
                    <small className="text-slate-400">Lote</small>
                    <h1 className="font-extrabold text-xl">{lote}</h1>
                </div>
                <div className="">
                    <small className="text-slate-400">Produto</small>
                    <h1 className="font-medium text-xs mt-[6px]">{produto}</h1>
                </div>
                <div className="flex justify-end col-span-2">
                    <div className="">
                        <small className="text-slate-400">Quantidade</small>
                        <h1 className="font-extrabold text-xl">{qtd}</h1>
                    </div>
                </div>
            </div>
        </>
    )
  }


  


  