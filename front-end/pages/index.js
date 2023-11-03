import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import profilePic from '../public/logonova.png'
import React from 'react'
import { useForm } from "react-hook-form";
import Modal from '../components/Modal';


export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [modal,setModal] = React.useState(false);
  const [title,setTitle] = React.useState('...');
  const [msg,setMsg] = React.useState('...');
  
  const verificar = (data) => {
    // alert(data.cod);
  }
  
  return (
    <>
    <div className={styles.head}>
      {/* <Image
        src={profilePic}
        alt="Picture of the author"
        width={100}
        height={30}
        /> */}
    </div>
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Entrar
        </h1>
        <p className={styles.subtitle}>
          Digite o código de acesso
        </p>
        <form onSubmit={handleSubmit(verificar)}>
          <div className={styles.input_round}>
            <input 
            {...register('cod', { required: true, maxLength: 13 })}
            className={styles.input_opacity} 
            placeholder="Código"
            type="text"/>
            <button className={styles.button}>ENTRAR</button>
          </div>
        </form>
        {/* <form onSubmit={handleSubmit(verificar2)}>
        <div className={styles.input_mobile}>
          <input 
          className={styles.input_opacity_mobi} 
          placeholder="Enter the serial number"
          type="text"/>
          <button className={styles.button_mobi}>Verify</button>
        </div>
        </form> */}
      </main>
    </div>
      <Modal show={modal} title={title} onClose={() => setModal(false)}>
        {msg}
      </Modal>
    </>
  )
}
