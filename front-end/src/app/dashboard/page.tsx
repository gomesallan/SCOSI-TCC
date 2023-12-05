'use client'
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogAlertBase, DialogFormBase } from "./components/dialog";
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area"
import { Check, Pencil, Trash, RefreshCcw, Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { parseCookies } from "nookies";
import { Skeleton } from "@/components/ui/skeleton"
import { Produto } from "./produtos/tabela/colunas";
import { Parceiro } from "./parceiros/tabela/colunas";
import { Formulario } from "./novo";
import { useForm } from "react-hook-form";
import { DialogClose } from "@radix-ui/react-dialog";
import { userAgent } from "next/server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";


type Ordem = {
    id:number
    data_alteracao:Date
    lote:number
    qtd:number
    produto: Produto
    parceiro: Parceiro
    status:string
}

export default function Home() {
    const { 'scosi.token': token_cookie }:any = parseCookies();
    const { 'scosi.tipo': usuariotipo }:any = parseCookies();
    const { 'scosi.id': usuarioid }:any = parseCookies();
    const [listaNova,setListaNova] = useState<Ordem[]>([]);
    const [listaDefeito,setListaDefeito] = useState<Ordem[]>([]);
    const [listaAndamento,setListaAndamento] = useState<Ordem[]>([]);
    const [listaEnviadas,setListaEnviadas] = useState<Ordem[]>([]);
    const [listaConcluidas,setListaConcluidas] = useState<Ordem[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizar, setAtualizar] = useState('');
    const {usuario} = useContext(AuthContext)
    const tipo_usuario = usuariotipo;
    const router = useRouter()

    const listaStatus:any = [
        {
            status:'Nova',
            titulo:'Novas Ordens de Serviço',
            cor:'border-l-blue-400',
            acao:listaNova,
            set:setListaNova
        },
        {
            status:'Defeito',
            titulo:'Ordens com Defeito',
            cor:'border-l-red-500',
            acao:listaDefeito,
            set:setListaDefeito
        },
        {
            status:'Andamento',
            titulo:'Em Andamento',
            cor:'border-l-purple-400',
            acao:listaAndamento,
            set:setListaAndamento
        },
        {
            status:'Enviado',
            titulo:'Enviadas',
            cor:'border-l-yellow-300',
            acao:listaEnviadas,
            set:setListaEnviadas
        },
        {
            status:'Concluido',
            titulo:'Concluídas',
            cor:'border-l-green-400',
            acao:listaConcluidas,
            set:setListaConcluidas
        },
    ]

    async function dadosGet(){
        var contador = 0;
        listaStatus.map(async (dados:any) => {
            const dados_nova:any =  await axios.get(`${process.env.URL}ordem/listar-por-status/${dados.status}`,{
                headers:{
                    'Authorization': `Bearer ${token_cookie}`
                }
            });
            
            contador++;
            dados.set(dados_nova.data.data);
            if(contador == 5){
                setCarregando(false)
            }
        })
    }
    async function dadosGetParceiro(status:any){
        var contador = 0;
        listaStatus.map(async (dados:any) => {
            const dados_nova:any =  await axios.get(`${process.env.URL}ordem/listar-por-status-e-parceiro/${status}/${dados.status}`,{
                headers:{
                    'Authorization': `Bearer ${token_cookie}`
                }
            });
            contador++;
            dados.set(dados_nova.data.data);
            if(contador == 5){
                setCarregando(false)
            }
        })
    }
    
    
    useEffect(() =>{
        setAtualizar('');
        
        console.log(usuariotipo)
        if(usuariotipo == 'Administrador'){
            dadosGet()
        }else{
            dadosGetParceiro(usuarioid)
        }
    },[atualizar])

    
    
    
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
                        formulario={<Formulario atualizar={setAtualizar}/>}
                        
                    />):
                    null
                    }
                </div>
            </div>
          </div>
          
            <ScrollArea className="w-full py-10 whitespace-nowrap">
                <div className="flex flex-row">
                    {listaStatus.map((obj:any) => {
                        return(
                    <div className="w-96" key={obj.cor}>
                        <h1 className="font-bold text-xl mb-10">{obj.titulo}</h1>
                        {carregando ?
                        <Carregando/>
                        :
                         obj.acao?.map((data:Ordem) => {
                            return(
                            <CardOrdem
                            key={data.id}
                            tipo_usuario={tipo_usuario}
                            status={data.status}
                            data={data.data_alteracao}
                            lote={data.lote}
                            produto={data.produto.nome}
                            qtd={data.qtd}
                            parceiro={data.parceiro.nome}
                            cor={obj.cor}
                            id={data.id}
                            token={token_cookie}
                            atualizar={setAtualizar}
                            etiqueta={data.produto.etiqueta}
                            router={router}
                            setCarregando={setCarregando}
                            />
                            )
                        }
                        )
                            
                        }
                        {(obj.acao.length == 0) && (!carregando)? <center><small className="text-slate-400">Nenhum registro</small></center>:null}
                
                    </div>
                    )
                    }
                    )
                    }
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
      </div>  
    )
  }

  async function gerarCSV(id:number,token:any,router:any,atualizar:any,setCarregando:any){
    try{
        await axios.put(`${process.env.URL}ordem/alterar-status/${id}`,
            {
                status:"Andamento"
            },{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        atualizar(id);
        // setCarregando(false)
        router.push(`${process.env.URL}arquivo/gerar/${id}`,'_blank')
    }catch(e){
        setCarregando(false)
        console.log(e)
    }
}
  async function alterarStatus(id:number,token:any,router:any,atualizar:any,status:any,setCarregando:any){
    setCarregando(true)
    try{
        await axios.put(`${process.env.URL}ordem/alterar-status/${id}`,
            {
                status:status
            },{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        atualizar(id);
        // setCarregando(false)
    }catch(e){
        setCarregando(false)
        console.log(e)
    }
}
   
  function CardOrdem({
    id,
    data,
    lote,
    produto,
    qtd,
    status,
    parceiro,
    tipo_usuario,
    cor,
    token,
    atualizar,
    etiqueta,
    router,
    setCarregando
  }:any){
    const classNameCard = `
        hover:shadow-lg 
        border-l-4 mr-4 p-5
        ${cor}
        mb-2
    `;
    const msgAlertaExcluir = `Deseja Realmete APAGAR a ordem de serviço do lote ${lote} do produto ${produto} ?`;
    const msgAlertaDefeito = `Deseja Realmete marcar esse lote como DEFEITUOSO?`;
    const { register, handleSubmit,setValue } = useForm({ shouldUseNativeValidation: true });
    const [btnCarregar,setBtnCarregar] = useState(false);
    const [btnSucesso,setBtnSucesso] = useState(false);

    async function deletar(data:any) {
        setBtnCarregar(true)
        console.log(data)
        await axios.delete(`${process.env.URL}/ordem/excluir/${data.id}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setBtnSucesso(true);
        atualizar(token)
      }
    return (
        <div >
            {/* <ScrollArea className="py-10 h-[700px]"> */}
                <Card className={classNameCard}>  
                {/* PARTE VISIVEL SOMENTE PARA "ADMIN" */}
                { (tipo_usuario == 'Administrador') && 
                (status == 'Urgencia' || 
                status == 'Nova' ) 
                ? (
                    <div className="flex mb-4">
                                
                        <DialogAlertBase 
                            btn={<Button variant="destructive" className="mr-1" size="icon"><Trash size={18}/></Button>} 
                            titulo="Atenção!" 
                            descricao={msgAlertaExcluir}
                            form={<>
                            <form onSubmit={handleSubmit(deletar)}>
                                <input type="hidden" {... register('id')} defaultValue={id} />
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                    Não
                                    </Button>
                                </DialogClose>
                                {btnCarregar ?(
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sim
                                    </Button>
                                )
                                :
                                    btnSucesso ?
                                
                                    <Button disabled className="bg-green-500">
                                        <Check className="mr-2 h-4 w-4 animate-pulse" />
                                        Sucesso!
                                    </Button>
                                    :
                                    <Button type="submit">Sim</Button>
                                }
                            </form>
                            </>}
                            />

                        
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
                            descricao={msgAlertaDefeito}
                            form={
                                <><DialogClose asChild>
                                <Button type="button" variant="secondary">
                                Não
                                </Button>
                            </DialogClose>
                                    <Button onClick={() =>{alterarStatus(id,token,router,atualizar,"Defeito",setCarregando)}}>Sim</Button>
                                </>
                                }/>
                        
                        <Button  onClick={() =>{alterarStatus(id,token,router,atualizar,"Concluido",setCarregando)}} className="bg-green-500 hover:bg-green-700" size="sm"><Check size={18} className="mr-2"/> Concluir</Button>
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
                <div className="grid grid-cols-2 mt-3">
                    <small className="text-slate-400 ">PARCEIRO : </small>
                    <div className="flex justify-end">
                        <small className="text-black ">{parceiro}</small>
                    </div>
                </div>
                {/* PARTE VISIVEL SOMENTE PARA "PARCEIRO" */}
                { 
                (tipo_usuario == 'Parceiro') && 
                (status != 'Enviado' &&
                status != 'Concluido')
                ? (
                    <div className={cn(
                        "grid mt-8",
                        status == "Andamento"?
                        "grid-cols-3":
                        "grid-cols-2"
                        )}>
                        <div className="flex">
                            <Link target="_blank" href={etiqueta.url}>
                                <Button className="mr-1" variant="secondary"><small>Etiqueta</small></Button>
                            </Link>
                        </div>
                        {status == "Andamento"?
                        
                    <div className="flex justify-center">
                        <Button onClick={() =>{alterarStatus(id,token,router,atualizar,"Enviado",setCarregando)}} variant="outline" className="bg-transparent border-spacing-2"><small>Enviar Lote</small></Button>

                    </div>
                :
                    null}
                        <div className="flex justify-end">
                            <Button onClick={() =>{gerarCSV(id,token,router,atualizar,setCarregando)}} className="bg-green-500 hover:bg-green-700"><small>Gerar .CSV</small></Button>

                        </div>
                    </div>
                )
                :
                
                null
                }
                
                </Card>
            {/* </ScrollArea> */}
        </div>
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
                    <small className="text-slate-400 ">{dataAtualFormatada(data)}</small>
                </div>
            </div>
            <div className="grid grid-cols-4 mt-2">
                <div>
                    <small className="text-slate-400">Lote</small>
                    <h1 className="font-extrabold text-xl">{("000" + lote).slice(-3)}</h1>
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

  function Carregando(){
    return(
        <Card className="flex items-center space-x-4 mr-5 mt-10 p-5 pb-7">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            </div>
        </Card>
    )
  }


  function dataAtualFormatada(dat:any){
    let data = new Date(dat),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
        var hora = ("00"+data.getHours()).slice(-2);
        var minuto = ("00"+data.getMinutes()).slice(-2);
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }
  


  