'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { LogOut } from "lucide-react"
import { AuthContext } from "@/contexts/AuthContext"
import { destroyCookie } from "nookies"
import { redirect, useRouter } from "next/navigation"

export default function Sair({nome}:any){
    const router = useRouter()
    return(
        <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                        <div className="flex">
                        <h1 className="mt-2 text-gray-400">{nome}</h1>
                        <Avatar className="ml-5">
                            <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { 
                            destroyCookie(undefined,'scosi.token');
                            destroyCookie(undefined,'scosi.tipo');
                            destroyCookie(undefined,'scosi.nome');
                            destroyCookie(undefined,'scosi.id');
                            router.push('/');
                            console.log('sair')
                         }}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
    )
}