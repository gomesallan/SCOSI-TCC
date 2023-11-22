"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DialogFormBase } from "../../components/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: number
  nome: string
  login: string
  ativo: string
  acao:any
}

export const columns: ColumnDef<Payment>[] = [
    
    {
        accessorKey: "nome",
        header: () => <div className="">Nome</div>,
        
        
    },
    {
        accessorKey: "login",
        header: "Login",
    },
    {
        accessorKey: "ativo",
        header: "Ativo",
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
