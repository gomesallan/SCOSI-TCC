
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  

export function DialogFormBase({
    btn,
    titulo,
    descricao,
    formulario
  }:any) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {btn}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{titulo}</DialogTitle>
            <DialogDescription>
              {descricao}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formulario}
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
export function DialogAlertBase({
    btn,
    titulo,
    descricao,
    formulario
  }:any) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {btn}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{titulo}</DialogTitle>
            <DialogDescription>
              {descricao}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formulario}
          </div>
          <DialogFooter>
            <DialogClose asChild>
            <Button type="button" variant="secondary">
              Não
            </Button>
          </DialogClose>
            <Button type="submit">Sim</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
