import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import profilePic from '../../public/logonova.png'
import React from 'react'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import requestIp from 'request-ip'
// import Modal from '../components/Modal';


export default function Home({ip}) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter()

  React.useEffect(() =>{
    if(ip == '::1' || ip == '200.150.74.114'){
      router.push('/admin/home');
    }else{
      router.push('/admin/error');
      
    }
  },[]);
  
  return (
    <>
    {/* <div className={styles.head}>
      <Image
        src={profilePic}
        alt="Picture of the author"
        width={100}
        height={30}
        />
    </div> */}
    <div className={styles.container}>
      <main className={styles.main}>
        {/* <Image
          src={profilePic}
          alt="Picture of the author"
          width={100}
          height={30}
          /> */}
        {/* <form onSubmit={handleSubmit(login)}>
          <div className={styles.input_round}>
            <input 
            {...register('login', { required: true, maxLength: 13 })}
            className={styles.input_opacity} 
            placeholder="Código"
            type="text"/>
            <button className={styles.button}>ENTRAR</button>
          </div>
        </form> */}
        
      </main>
    </div>
    </>
  )
}

export async function getServerSideProps({ req }) {
  // console.log(req.headers);
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  console.log(ip)
  return {
    props: {
      ip,
    }, // will be passed to the page component as props
  };
}
