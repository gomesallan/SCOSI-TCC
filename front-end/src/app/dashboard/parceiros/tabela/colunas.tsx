"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DialogFormBase } from "../../components/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Pencil } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import { parseCookies } from "nookies"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { AuthContext } from "@/contexts/AuthContext"
import { AlertErro } from "@/app/page"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Usuario ={
      id: number
			data_cadastro: Date
			login: string
			senha: string
			tipo: string
    }
export type Parceiro = {
      id: number
      data_cadastro: Date
      nome: string
      usuario_id: number
      ativo: number
      administrador_id:number
      usuario: Usuario
}

export const columns: ColumnDef<Parceiro>[] = [
    
    {
        accessorKey: "nome",
        header: () => <div className="">Nome</div>,
        
        
    },
    {
        accessorKey: "usuario",
        header: "Usuário",
        cell: ({ row }) => {
          const usuario = row.original.usuario
          return (
            <>{usuario.login}</>
          )
        }
    },
    {
        accessorKey: "ativo",
        header: "Ativo",
        cell: ({ row }) => {
          const parceiro = row.original
          return (
            <>{parceiro.ativo?"SIM":"NÃO"}</>
          )
        }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const parceiro = row.original
   
        return (
          <>
          <DialogFormBase 
        btn={<Button className="mr-1 bg-yellow-500 hover:bg-yellow-600 float-right" size="icon"><Pencil size={18}/></Button>} 
        titulo="Alterar Parceiro" 
        descricao="..."
        formulario={<FormularioAlterar dados={parceiro}/>}
        />
          </>
        )
      },
    },
    
]

function FormularioAlterar({dados}:any){
  const {usuario} = useContext(AuthContext)
  const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });
  const [erro, setErro] = useState('');
  const [btnCarregar, setBtnCarregar] = useState(false);
  const [btnSucesso, setBtnSucesso] = useState(false);
  const router = useRouter()

  async function handle(data:any) {
      setBtnCarregar(true);
      console.log(data)

      try {
        await alterar(data)      
        setBtnCarregar(false);
      } catch (error:any) {
        console.log(error.message);
        setErro(error.response.data.error|| error.message)
        setBtnCarregar(false);
      }
    }

  async function alterar({id,nome,login,senha}:any){
      
      const { 'scosi.token': token_cookie }:any = parseCookies();
      await axios.put(`${process.env.URL}parceiro/alterar/${id}`,{
          nome:nome,
          administrador_id:usuario?.id,
          usuario:{
              login:login,
              senha:senha
          }
          },{
              headers:{
                  'Authorization': `Bearer ${token_cookie}`
              }
          });

      setBtnSucesso(true)   

      window.location.reload()   
  }  
  return (
      
      <form onSubmit={handleSubmit(handle)}>
          {erro?<AlertErro erro={erro}/>:null}
          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <input {...register('id')} value={dados.id} type="hidden" />
              <Label htmlFor="name" className="text-right">
                  Nome
              </Label>
              <Input
                  {...register('nome',{ required: "Campo obrigatório!" })}
                  id="lote"
                  defaultValue={dados.nome}
                  className="col-span-3"
                  required
              />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                  Usuário
              </Label>
              <Input
                  {...register('login',{ required: "Campo obrigatório!" })}
                  id="qtd"
                  defaultValue={dados.usuario.login}
                  className="col-span-3"
              />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                  Senha
              </Label>
              <Input
                  {...register('senha')}
                  id="qtd"
                  defaultValue=""
                  className="col-span-3"
              />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                  Ativo
              </Label>
              <Select {...register('ativo')} defaultValue={dados.ativo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">SIM</SelectItem>
                  <SelectItem value="0">NÃO</SelectItem>
                </SelectContent>
              </Select>
              </div>
          </div>
          <DialogFooter>
              {btnCarregar ?(
                  <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvar
                  </Button>
              )
              :
                  btnSucesso ?
              
                  <Button disabled className="bg-green-500">
                      <Check className="mr-2 h-4 w-4 animate-pulse" />
                      Sucesso!
                  </Button>
                  :
                  <Button type="submit">Salvar</Button>
              }
          </DialogFooter>
      </form>
  )
  }