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
  referencia: string
  url: string
  acao:any
}

export const columns: ColumnDef<Payment>[] = [
    
    {
        accessorKey: "referencia",
        header: () => <div className="">Refêrencia</div>,
        
        
    },
    {
        accessorKey: "url",
        header: "Url",
        cell: ({ row }) => <Link className="hover:border-b-2 hover:border-b-black" target="_blank" href={row.original.url}>{row.original.url}</Link>
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
