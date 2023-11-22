"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DialogFormBase } from "../../components/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: number
  cod: number
  nome: string
  etiqueta: string
  acao:any
}

export const columns: ColumnDef<Payment>[] = [
    
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
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const produto = row.original
   
        return (
          <>
          {produto.acao}
          </>
        )
      },
    },
    
]
