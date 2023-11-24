"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DialogFormBase } from "../../components/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Pencil } from "lucide-react"
import Link from "next/link"
import { AlertErro } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectContent, SelectItem ,Select, SelectTrigger, SelectValue} from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { useForm } from "react-hook-form"
import { parseCookies } from "nookies"
import axios from "axios"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Etiqueta = {
  id: number
  referencia: string
  url: string
  ativo:number
}

export const columns: ColumnDef<Etiqueta>[] = [
    
    {
        accessorKey: "referencia",
        header: () => <div className="">Refêrencia</div>,
        
        
    },
    {
        accessorKey: "url",
        header: "Url",
        cell: ({ row }) => <Link className="hover:border-b-2 hover:border-b-black" target="_blank" href={row.original.url}>{row.original.url}</Link>
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
                Refêrencia
            </Label>
            <Input
                {...register('nome',{ required: "Campo obrigatório!" })}
                id="lote"
                defaultValue={dados.referencia}
                className="col-span-3"
                required
            />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
                Url
            </Label>
            <Input
                {...register('login',{ required: "Campo obrigatório!" })}
                id="qtd"
                defaultValue={dados.url}
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
