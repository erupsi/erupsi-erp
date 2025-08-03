import React, { useEffect, useState } from 'react'
import "./main.scss";
import Modal from '../../components/modal';

function Dashboard(){
    const [open, setOpen] = useState(false);


    return(
        <div className='main_content'>
            <div>
                <h1 className=' text-9xl'>INI DASHBOARD</h1>
            </div>
            <button onClick={() => setOpen(true)}>Pegang aku!</button>
            <Modal isOpen={open} onClose={() => setOpen(false)} animation="fade">
                <h2>NAMPILIN MODAL !!!!!!!!!!!!!</h2>
                <form>
                    <input placeholder="Tulis aku!" />
                    <button type="submit">Makasih!</button>
                </form>
            </Modal>
        </div>
    ) 
}

export default Dashboard;