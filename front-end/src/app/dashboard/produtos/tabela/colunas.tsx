"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DialogFormBase } from "../../components/dialog"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Loader2, Pencil } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import { parseCookies } from "nookies"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
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

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Produto = {
  id: number
  cod: number
  nome: string
  etiqueta: any
  ativo:number
}

export const columns: ColumnDef<Produto>[] = [
    
    {
        accessorKey: "cod",
        header: () => <div className="">COD</div>,
        
    },
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "etiqueta",
        header: "Etiqueta",
        cell: ({ row }) => {
          const etiqueta = row.original.etiqueta
          return (
            <Link className="hover:border-b-2 hover:border-b-black" target="_blank" href={etiqueta.url}>{etiqueta.referencia}</Link>
          )
        }
    },
    {
      accessorKey: "ativo",
      header: "Ativo",
      cell: ({ row }) => {
        const produto = row.original
        return (
          <>{produto.ativo?"SIM":"NÃO"}</>
        )
      }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const produto = row.original
 
      return (
        <>
        <DialogFormBase 
      btn={<Button className="mr-1 bg-yellow-500 hover:bg-yellow-600 float-right" size="icon"><Pencil size={18}/></Button>} 
      titulo="Alterar Produto" 
      descricao="..."
      formulario={<FormularioAlterar dados={produto}/>}
      />
        </>
      )
    },
  },
  
]

const FormSchema = z.object({
  etiqueta: z.string({
    required_error: "Please select a etiqueta.",
  }),
})

function FormularioAlterar({dados}:any){
    const { 'scosi.token': token_cookie }:any = parseCookies();
    const form = useForm<any>({
      resolver: zodResolver(FormSchema),
    })
    const {usuario} = useContext(AuthContext)
    const { register, handleSubmit,setValue } = useForm({ shouldUseNativeValidation: true });
    const [erro, setErro] = useState('');
    const [btnCarregar, setBtnCarregar] = useState(false);
    const [btnSucesso, setBtnSucesso] = useState(false);
    const router = useRouter()
    const [etiquetas, setEtiquetas] = useState<any>([]);

        useEffect(() =>{
            async function dadosGet(){
                const dados:any =  await axios.get(`${process.env.URL}etiqueta/listar-ativos`,{
                    headers:{
                        'Authorization': `Bearer ${token_cookie}`
                    }
                });
                setEtiquetas(dados.data);
            }
            dadosGet()
        },[])

    async function handle(data:any) {
        setBtnCarregar(true);

        try {
          await alterar(data)      
          setBtnCarregar(false);
        } catch (error:any) {
          console.log(error.message);
          setErro(error.response.data.error|| error.message)
          setBtnCarregar(false);
        }
      }

    async function alterar({id,nome,cod,etiqueta_id,ativo}:any){
        
        const { 'scosi.token': token_cookie }:any = parseCookies();
        await axios.put(`${process.env.URL}produto/alterar/${id}`,{
            nome:nome,
            cod:parseInt(cod),
            etiqueta_id:parseInt(etiqueta_id),
            ativo:parseInt(ativo)
            },{
                headers:{
                    'Authorization': `Bearer ${token_cookie}`
                }
            });

        setBtnSucesso(true)   

        window.location.reload()   
    }  
    return (
        
      <Form {...form}>
      <form onSubmit={handleSubmit(handle)}>
          {erro?<AlertErro erro={erro}/>:null}
      <FormField
        control={form.control}
        name="etiqueta"
        render={({ field }) => (
          <div className="grid gap-4 py-4">
            <input {... register('id')} defaultValue={dados.id} type="hidden" />
              <div className="grid grid-cols-4 items-center gap-4">
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
                  COD
              </Label>
              <Input
                  {...register('cod',{ required: "Campo obrigatório!" })}
                  id="qtd"
                  defaultValue={dados.cod}
                  className="col-span-3"
              />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                  Ativo
              </Label>
              <input {... register('ativo')} type="hidden" defaultValue={dados.ativo}/>
              <Select onValueChange={(eve) => { setValue('ativo',eve)}} defaultValue={dados.ativo.toString()}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">SIM</SelectItem>
                  <SelectItem value="0">NÃO</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                  Etiqueta
              </Label>
              <input {...register('etiqueta_id',{required: "Campo obrigatório!" }) } defaultValue={dados.etiqueta_id} type="hidden" />
          <FormItem className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? etiquetas.find(
                          (etiqueta:any) => etiqueta.id === field.value
                        )?.referencia
                      : dados.etiqueta.referencia}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Selecione..." />
                  <CommandEmpty>Não encontrado.</CommandEmpty>
                  <CommandGroup>
                    {etiquetas.map((etiqueta:any) => (
                      <CommandItem
                        value={etiqueta.referencia}
                        key={etiqueta.id}
                        onSelect={() => {
                          form.setValue("etiqueta", etiqueta.id)
                          setValue('etiqueta_id',etiqueta.id)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            etiqueta.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {etiqueta.referencia}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
              </div>
          </div>
        )}/>
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
      </Form>
    )
}