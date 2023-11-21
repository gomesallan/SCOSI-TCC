import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Link from 'next/link'

export default function Menu(){
    return (
        <nav className="flex py-8 px-10">
            <h1 className="font-black text-xl mt-2">SCOSI </h1>
            <div className=" mx-10">
                <ToggleGroup type="single" defaultValue="inicio">
                    <Link href="/dashboard">
                        <ToggleGroupItem value="inicio">Início</ToggleGroupItem>
                    </Link>
                    <Link href="/dashboard/produtos">
                        <ToggleGroupItem value="produtos">Produtos</ToggleGroupItem>
                    </Link>
                    <Link href="/dashboard">
                        <ToggleGroupItem value="etiquetas">Etiquetas</ToggleGroupItem>
                    </Link>
                    <Link href="/dashboard">
                        <ToggleGroupItem value="parceiros">Parceiros</ToggleGroupItem>
                    </Link>
                </ToggleGroup>
            </div>


        </nav>
    );
}