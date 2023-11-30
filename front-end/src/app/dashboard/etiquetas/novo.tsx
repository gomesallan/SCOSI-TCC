"use client"

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Etiqueta } from "./tabela/colunas";
import axios from "axios";
import { parseCookies } from "nookies";
import { AuthContext } from "@/contexts/AuthContext";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertErro } from "../components/alert";

export  function Formulario({atualizar}:any){
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
          await novo(data)      
          setBtnCarregar(false);
        } catch (error:any) {
          console.log(error.message);
          setErro(error.response.data.error|| error.message)
          setBtnCarregar(false);
        }
      }

    async function novo({referencia,url}:any){
        
        const { 'scosi.token': token_cookie }:any = parseCookies();
        await axios.post(`${process.env.URL}etiqueta/cadastrar`,{
            referencia:referencia,
            url:url
            },{
                headers:{
                    'Authorization': `Bearer ${token_cookie}`
                }
            });

        setBtnSucesso(true)  
        atualizar(token_cookie);  

        router.push('/dashboard/etiquetas')    
    }  
    return (
        
        <form onSubmit={handleSubmit(handle)}>
            {erro?<AlertErro erro={erro}/>:null}
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Referência
                </Label>
                <Input
                    {...register('referencia',{ required: "Campo obrigatório!" })}
                    id="lote"
                    defaultValue=""
                    className="col-span-3"
                    required
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                    Url
                </Label>
                <Input
                    {...register('url',{ required: "Campo obrigatório!" })}
                    id="qtd"
                    defaultValue=""
                    className="col-span-3"
                />
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