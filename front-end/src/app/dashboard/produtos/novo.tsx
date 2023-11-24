"use client"

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Produto } from "./tabela/colunas";
import axios from "axios";
import { parseCookies } from "nookies";
import { AuthContext } from "@/contexts/AuthContext";
import { AlertErro } from "@/app/page";
import { Check, Loader2,ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
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

  const FormSchema = z.object({
    etiqueta: z.string({
      required_error: "Please select a etiqueta.",
    }),
  })

export  function Formulario({atualizar}:any){
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
        // console.log(data)

        try {
          await novo(data)      
          setBtnCarregar(false);
        } catch (error:any) {
          console.log(error.message);
          setErro(error.response.data.error|| error.message)
          setBtnCarregar(false);
        }
      }

    async function novo({nome,cod,etiqueta_id}:any){
        
        const { 'scosi.token': token_cookie }:any = parseCookies();
        await axios.post(`${process.env.URL}produto/cadastrar`,{
            nome:nome,
            cod:parseInt(cod),
            etiqueta_id:etiqueta_id
            },{
                headers:{
                    'Authorization': `Bearer ${token_cookie}`
                }
            });

        setBtnSucesso(true)  
        atualizar(token_cookie);  

        router.push('/dashboard/produtos')    
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
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Nome
                </Label>
                <Input
                    {...register('nome',{ required: "Campo obrigatório!" })}
                    id="lote"
                    defaultValue=""
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
                    defaultValue=""
                    className="col-span-3"
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                    Etiqueta
                </Label>
                <input {...register('etiqueta_id',{required: "Campo obrigatório!" }) } type="hidden" />
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
                        : "Selecione"}
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