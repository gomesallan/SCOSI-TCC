export function dataAtualFormatada(dat:any){
    let data = new Date(dat),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
        var hora = ("00"+data.getHours()).slice(-2);
        var minuto = ("00"+data.getMinutes()).slice(-2);
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }