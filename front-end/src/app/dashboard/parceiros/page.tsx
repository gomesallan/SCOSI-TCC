import { Button } from "@/components/ui/button";
import { DialogFormBase } from "../components/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Payment, columns } from "./tabela/colunas"
import { DataTable } from "./tabela/data-table"
import { Pencil } from "lucide-react";
 
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      nome: "Garfica BGRAF",
      usuario: "bgraf",
      ativo:"SIM",
      acao:(<DialogFormBase 
        btn={<Button className="mr-1 bg-yellow-500 hover:bg-yellow-600 float-right" size="icon"><Pencil size={18}/></Button>} 
        titulo="Alterar Parceiro" 
        descricao="..."
        formulario={FormularioAlterar()}
        />)
    },
    
    // ...
  ]
}
export default async function Home() {
  const data = await getData()
    return (
      <div className="min-h-screen bg-slate-100 p-10">
          <div className=" grid grid-cols-2 ">
            <div className="">
              <h2 className="font-medium text-2xl ">Parceiros</h2>
              <p className="text-slate-400">Página responsável pelo controle dos parceiros</p>
            </div>
            <div className="flex justify-end">
                <div className="text-right mt-2">
                    <DialogFormBase 
                        btn={<Button>Novo Parceiro</Button>} 
                        titulo="Cadastrar Parceiro" 
                        descricao="Preencha os campos abaixo para cadastrar um novo Parceiro."
                        formulario={Formulario()}
                        
                    />
                </div>
            </div>
          </div>
          <div className="mx-auto py-10">
            <DataTable  columns={columns} data={data} />
            
          </div>
        </div>
    )
  }

  function Formulario(){
    return (
        <>
        <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="lote"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuário
              </Label>
              <Input
                id="qtd"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Senha
              </Label>
              <Input
                id="qtd"
                defaultValue=""
                className="col-span-3"
              />
            </div>
        </>
    )
  }

  function FormularioAlterar(){
    return (
        <>
        <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="lote"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuário
              </Label>
              <Input
                id="qtd"
                defaultValue=""
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Senha
              </Label>
              <Input
                id="qtd"
                defaultValue=""
                className="col-span-3"
              />
            </div>
        </>
    )
  }