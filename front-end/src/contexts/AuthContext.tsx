"use client"

import { createContext, useEffect, useState } from 'react';
import axios  from "axios";
import { parseCookies, setCookie }  from "nookies";
import { useRouter } from 'next/navigation'

type Usuario = {
    login:string;
    nome:string;
    usuario:any;
}

type SignInData = {
    usu:string;
    senha:string;
}

type AutheContextType = {
    isAuthenticated:boolean;
    usuario:Usuario | null;
    signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AutheContextType);

export function AuthProvider({children}:any){
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const router = useRouter()

    const isAuthenticated = !!usuario;

    useEffect(() => {
        async function consultarToken(){
            const { 'scosi.token': token_cookie }:any = parseCookies();
    
            if (token_cookie) {
                const dados:any =  await axios.post(`${process.env.URL}usuario/token`,{
                    token:token_cookie
                },{
                    headers:{
                        'Authorization': `Bearer ${token_cookie}`
                    }
                });
                const usuario:any = dados.data;

                setUsuario(usuario);
            }
        }
        consultarToken()
        
    },[]);

    async function signIn({usu,senha} : SignInData){
        const dados:any =  await axios.post(`${process.env.URL}usuario/login`,{login:usu,senha:senha});
        const {usuario,token}:any = dados.data;
        console.log(token);
        setCookie(undefined, 'scosi.token',token,{
            maxAge: 60 * 60 * 24 * 20, // 20 dias
        });

        setUsuario(usuario);

        typeof window !== 'undefined' && router.push('/dashboard')

    }

    return (
        <AuthContext.Provider value={{ usuario, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}


