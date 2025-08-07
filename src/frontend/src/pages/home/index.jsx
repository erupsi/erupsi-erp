import React, { useEffect, useState } from 'react'
import "./main.scss";

function Home({setGrandchildItems}){
     useEffect(() => {
            const grandchild = [];
            setGrandchildItems(grandchild);
        }, [setGrandchildItems]);
    return(
        <div className='main_content'>
            <span className=' text-9xl'>Dashboard</span>
        </div>
    )
}

export default Home;