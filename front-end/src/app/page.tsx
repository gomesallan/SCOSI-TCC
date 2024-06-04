"use client"

import {useContext, useState} from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"

import { useForm } from 'react-hook-form' 
import { AuthContext } from "@/contexts/AuthContext"
import { AlertErro } from "./dashboard/components/alert"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center">
      <CardLogin/>
    </div>
  )
}
 function CardLogin() {
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);
  const [erro, setErro] = useState('');
  const [btnCarregar, setBtnCarregar] = useState(false);

  const txtbtn = 'Entrar';

  async function handleSignIn(data:any) {
    setBtnCarregar(true);
    try {
      await signIn(data)      
      setBtnCarregar(false);
    } catch (error:any) {
      console.log(error);
      setErro(error.response.data.error)
      setBtnCarregar(false);
    }
  }

  return (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Informe seu usuário e senha.</CardDescription>
      </CardHeader>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <CardContent>
              <div className="grid w-full items-center gap-4">
                {erro?<AlertErro erro={erro}/>:null}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Usuário</Label>
                  <Input {...register('usu')} id="name" placeholder="" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="senha">Senha</Label>
                  <Input {...register('senha')} type="password" id="senha" placeholder="" />
                </div>
              </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {btnCarregar ?
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {txtbtn}
              </Button>
            :
              <Button >{txtbtn}</Button>
            }
          </CardFooter>
        </form>
    </Card>
  )
}

