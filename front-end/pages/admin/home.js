import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import profilePic from '../../public/logonova.png'
import React from 'react'
import { set, useForm } from "react-hook-form";
import axios from 'axios';
import { useQRCode } from 'next-qrcode';
import Barcode from 'react-barcode';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from '../../components/Modal';


export default function Home() {
  const URL = "https://secret-bastion-30720.herokuapp.com/api/v1/";
  const URL1 = "http://localhost:7800/api/v1/";
  const { Canvas } = useQRCode();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [modal,setModal] = React.useState(false);
  const [lote,setLote] = React.useState([]);
  const [title, setTitle] = React.useState('Aguarde...');
  const [msg, setMsg] = React.useState('');
  const [spinnerList, setSpinnerList] = React.useState(true);
  const [visible,setVisible] = React.useState(true);
  const [success,setSuccess] = React.useState(false);
  const [dialog,setDialog] = React.useState(false);

  React.useEffect(async () => {
    // alert(2);
    await listar();
  },[]);

  const listar = async () =>{
    await axios.get(URL+'production/listOrder')
    .then(async res => {
      // console.log(res.data);
      setSpinnerList(false)
      setLote(res.data.data)
    }).catch( error => {
      setModal(true);
      setDialog(true);
      setTitle('Erro');
      setMsg(error+'');
      console.log(error);
    });
  }

  function dataAtualFormatada(dat){
    let data = new Date(dat),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear();
        var hora = ("00"+data.getHours()).slice(-2);
        var minuto = ("00"+data.getMinutes()).slice(-2);
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  const salvar =  async (data) => {
    setModal(true);
    setTitle('Aguardando...');
    setDialog(false);
    
    await axios.post(URL+'finished_product/ean13',
    {
      cod_produto:data.cod,
      lote:("000" + data.lote).slice(-3),
      qtd:data.qtd,
      produto:data.produto,
      etiqueta:data.tipo,
      comex: data.comex
    })
    .then(async response => {
      console.log(response)
      await listar();
      setModal(false);
      
    }).catch(error => {
      setDialog(true);
      setTitle('Erro código '+error.response.status);
      setMsg(error.response.data.error);
      console.log(error.response);
    });
  }
  
  return (
    <>
    <div className={styles.head}>
      <Image
        src={profilePic}
        alt="Picture of the author"
        width={100}
        height={30}
        />
    </div>
    <div className={styles.container}>
        <h1 className={styles.secondarytitle}>
          Ordens de Serviço
        </h1>
        <h2 className={styles.subtitle}>
          Página para registro de numero de serie e hash para validação de produto.
        </h2>
        <form onSubmit={handleSubmit(salvar)}>
            <div className={styles.form_inline}>
              <div className={styles.item}>
                <label className={styles.label}>Código Produto</label><br></br>
                <input 
                {...register('cod', { required: true, maxLength: 13 })}
                className={styles.input_round} 
                placeholder=""
                type="text"/>
              </div>
              <div className={styles.item}>
                <label className={styles.label}>Tipo</label><br></br>
                <select 
                {...register('comex', { required: true })}
                className={styles.input_round} 
                placeholder="">
                  <option value="0">BR</option>
                  <option value="1">CMX</option>
                </select>
              </div>
              <div className={styles.item}>
                <label className={styles.label}>Lote</label><br></br>
                <input 
                {...register('lote', { required: true, maxLength: 13 })}
                className={styles.input_round} 
                placeholder=""
                type="text"/>
              </div>
              <div className={styles.item}>
                <label className={styles.label}>Quantidade</label><br></br>
                <input 
                {...register('qtd', { required: true, maxLength: 13 })}
                className={styles.input_round} 
                placeholder=""
                type="text"/>
              </div>  
              <div className={styles.item}>
                <label className={styles.label}>Tipo de Etiqueta</label><br></br>
                <input 
                {...register('tipo', { required: true})}
                className={styles.input_round} 
                placeholder=""
                type="text"/>
              </div>
              {/* <div className={styles.item}>
                <label className={styles.label}>Produto</label><br></br>
                <input 
                {...register('produto', { required: true, maxLength: 13 })}
                className={styles.input_round} 
                placeholder=""
                type="text"/>
              </div> */}
            </div>
           {visible?
              <button className={styles.button}>SALVAR</button>
           :
              null
            }
        </form>
        <center>
          
          <h1 className={styles.secondarytitle2}>
            Lista de Ordens de Serviço
          </h1>
        </center>    
        
    </div>
    {/* <div className={styles.grid}> */}
    <div className={styles.colum}>
      <center>
      {/* <table> */}
        {/* <tr>
          <th>NSERIE</th>
          <th>QR CODE</th>
        </tr> */}
        <ClipLoader color={'#d5bd7c'} loading={spinnerList} size={50} ></ClipLoader>

        {lote.map(data =>(
          <div key={data.data} className={styles.card}>
            <div className={styles.grid}>
              <div>
                <small>Lote:</small>
                <h1>{('0'+data.lote).slice(-3)}</h1>
              </div>
              <div>
                <small>Produto:</small>
                <h4>{data.produto}</h4>
              </div>
              <div>
                <small>Data:</small>
                <h4>{dataAtualFormatada(data.data_cadastro)}</h4>
              </div>
              <div>
                <small>Quantidade:</small>
                <h4>{data.qtd}</h4>
              </div>
              <div>
                <small>Referência:</small>
                <h4>{data.etiqueta}</h4>
              </div>
              <div className={styles.left}>
              <a href={URL+"file/generate/"+data.cod_produto+"/"+data.lote+"/"+(data.etiqueta)+"/"+data.qtd}><button className={styles.buttondown}>DOWNLOAD</button></a>
              </div>
            </div>
          </div>
          

        // <tr>
        // <div className={styles.item1}>
        //   <div className={styles.ticket}>
        //     {/* <label className={styles.label}>{data.nserie}</label> */}
        //     <div className={styles.qrcodevolts}>
        //     <div className={styles.parentqrcode}>
        //     <Canvas
        //       text={data.hash}
        //       options={{
        //         type: 'image/jpeg',
        //         quality: 0.3,
        //         level: 'M',
        //         margin: 3,
        //         scale: 4,
        //         width: 89,
        //         color: {
        //           dark: '#000',
        //           light: '#fff',
        //         },
        //       }}
        //       />
        //       </div>
        //       <div className={styles.parentvolts}>
        //         <label className={styles.volts}>127V</label>
        //       </div>
        //       </div>
        //     <Barcode 
        //     value={data.nserie}
        //     formart="EAN13"
        //     height="22"
        //     fontSize="10"
        //     textMargin="0"
        //     width={1.5}
        //     flat={true}
        //     />
            
        //     </div>
        //   </div>
        ))}
        </center>
    </div>
    <Modal show={modal} dialog={dialog} msg={msg} title={title} onClose={() => setModal(false)}>
       
      </Modal>
    </>
  )
}
