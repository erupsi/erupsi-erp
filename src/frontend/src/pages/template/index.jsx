import React, { useEffect, useState } from 'react'
import "./main.scss";
import Modal from '../../components/modal';

function Template(){
    const [open, setOpen] = useState(false);


    return(
        // design 'main_content' diambil dari ../App.scss
        <div className='main_content'> 
            <div>
                <h1>Selamat datang di Erupsi-erp</h1>
            </div>
            <button onClick={() => setOpen(true)}>Sentuh aku!</button>
            <Modal isOpen={open} onClose={() => setOpen(false)} animation="slide"> 
                <h2>Contoh penggunaan modal</h2>
                <form>
                    <input placeholder="Tulis aku!" />
                    <button type="submit">Makasih!</button>
                </form>
            </Modal>
        </div>
    )
}

export default Template;