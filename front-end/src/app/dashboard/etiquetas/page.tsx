'use client'

import { Button } from "@/components/ui/button";
import { DialogFormBase } from "../components/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Etiqueta, columns } from "./tabela/colunas"
import { DataTable } from "./tabela/data-table"
import { Pencil } from "lucide-react";
import { parseCookies } from "nookies";
import axios from "axios";
import { useEffect, useState } from "react";
import { Formulario } from "./novo";
 
async function getData(): Promise<Etiqueta[]> {
  const { 'scosi.token': token_cookie }:any = parseCookies();
  // const token_cookie = cookies().get('scosi.token')?.value;
      try{

        const dados:any =  await axios.get(`${process.env.URL}etiqueta/listar-todos`,{
            headers:{
                'Authorization': `Bearer ${token_cookie}`
            }
        });
        const etiqueta:any = dados.data;
        // console.log(usuario);
        return etiqueta
      }catch(e){
          // console.log(e)
          const etiqueta:any = [];
          return etiqueta;
      }

  // Fetch data from your API here.
  
}

export default function Home() {
  const [data, setData] = useState<Etiqueta[]>();
  const [atualizar,setAtualizar] = useState('');
  useEffect(() => {
    async function dataGet(){

      const data:any = await getData()
      setData(data)
      console.log(data)
    }
    dataGet();
  },[atualizar])
    return (
      <div className="min-h-screen bg-slate-100 p-10">
          <div className=" grid grid-cols-2 ">
            <div className="">
              <h2 className="font-medium text-2xl ">Etiquetas</h2>
              <p className="text-slate-400">Página responsável pelo controle das etiquetas</p>
            </div>
            <div className="flex justify-end">
                <div className="text-right mt-2">
                    <DialogFormBase 
                        btn={<Button>Nova Etiqueta</Button>} 
                        titulo="Cadastrar Etiqueta" 
                        descricao="Preencha os campos abaixo para cadastrar um novo Etiqueta."
                        formulario={<Formulario atualizar={setAtualizar}/>}
                        
                    />
                </div>
            </div>
          </div>
          <div className="mx-auto py-10">
            {data?
            <DataTable  columns={columns} data={data} />
            :
            null
            }
            
          </div>
        </div>
    )
  }
  