import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Link from 'next/link'
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

export default function Menu(){
    return (
        <nav className="">
            {/* logo enfeitada kkk
            <h1 className="font-black text-3xl  box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">SCOSI </h1> */}
            <div className="grid grid-cols-8  py-5 px-10">
                <h1 className="font-black text-3xl flex items-center ">SCOSI </h1>
                <div className=" ml-10 z-10">
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
                </div>
                <div className="flex justify-end col-span-6 ">
                    
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                        <div className="flex">
                        <h1 className="mt-2 text-gray-400">Allan</h1>
                        <Avatar className="ml-5">
                            <AvatarImage src="https://github.com/gomesallan.png" />
                            <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>


        </nav>
    );
}