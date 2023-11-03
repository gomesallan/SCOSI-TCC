import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/Modal.module.css';
import ClipLoader from "react-spinners/ClipLoader";

export default function Modal({show, onClose,msg,title,dialog}) {
    const [isBrowser,setIsBrowser] = React.useState(false);

    useEffect(() => {
        setIsBrowser(true);
    },[]);
    
    const handleClose = (e) => {
        e.preventDefault();
        onClose();
    }

    const modalContent = show ? (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <center>
                        <h2 className={styles.title}>{title}</h2>
                        {/* <a href="#" onClick={handleClose}>
                            <button className="btn">Close</button>
                        </a> */}
                    </center>
                </div>
                <div className={styles.body}>
                    <center>
                        {dialog?
                            msg
                        :
                            <ClipLoader color={'#d5bd7c'} loading={true} size={50} ></ClipLoader>
                        }
                    </center>
                </div>
                {dialog?
                <a href="#" className={styles.link} onClick={handleClose}>
                    <p className={styles.title}>Ok</p>
                </a>
                :
                null
                }

            </div>
        </div>
    ):null;

    if(isBrowser){
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root")
        )
    }else{
        return null;
    }
}