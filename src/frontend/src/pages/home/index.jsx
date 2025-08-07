import React, { useEffect, useState } from 'react'
import "./main.scss";
import Modal from '../../components/modal';

function Home({setGrandchildItems}){
    
     useEffect(() => {
            const grandchild = [
                // { id: 'contoh', label: 'contoh' },
                // { id: 'contohdua', label: 'contoh dua' }
            ];
            setGrandchildItems(grandchild);
        }, [setGrandchildItems]);
    return(
        <div className='main_content'>
            <span className=' text-9xl'>Dashboard</span>
        </div>
    )
}

export default Home;