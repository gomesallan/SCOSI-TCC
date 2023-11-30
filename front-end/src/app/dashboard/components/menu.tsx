import { useContext } from "react"
import Link from 'next/link'

import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { cookies } from "next/headers"
import Sair from "./sair"

export default function Menu(){
    const nome:any =  cookies().get('scosi.nome')?.value;
    const tipo:any =  cookies().get('scosi.tipo')?.value;
    const id:any =  cookies().get('scosi.id')?.value;
    console.log(nome)
    // const router = useRouter()

    return (
        <nav className="">
            {/* logo enfeitada kkk
            <h1 className="font-black text-3xl  box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">SCOSI </h1> */}
            <div className="grid grid-cols-8  py-5 px-10">
                <h1 className="font-black text-3xl flex items-center ">SCOSI </h1>
                <div className=" ml-10 z-10">
                    { tipo == 'Administrador'? (  
                        <ToggleGroup type="single" defaultValue="inicio">
                            <Link href="/dashboard">
                                <ToggleGroupItem value="inicio">Início</ToggleGroupItem>
                            </Link>
                            <Link href="/dashboard/produtos">
                                <ToggleGroupItem value="produtos">Produtos</ToggleGroupItem>
                            </Link>
                            <Link href="/dashboard/etiquetas">
                                <ToggleGroupItem value="etiquetas">Etiquetas</ToggleGroupItem>
                            </Link>
                            <Link href="/dashboard/parceiros">
                                <ToggleGroupItem value="parceiros">Parceiros</ToggleGroupItem>
                            </Link>
                        </ToggleGroup>
                    ):null

                    }
                </div>
                <div className="flex justify-end col-span-6 ">
                    <Sair nome={nome}/>
                    
                </div>
            </div>


        </nav>
    );
}

function sair(){}