import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./main.scss";
import Modal from '../../components/modal';

function Example({ setGrandchildItems }) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    // const [selectedProduct, setSelectedProduct] = useState(null);

    const openModal = (type, product = null) => {
        setModalType(type);
        // setSelectedProduct(product);
        setOpen(true);
        
        if (type === 'view' && product) {
            const newUrl = `${window.location.pathname}?product=${product.id_products || product.id}`;
            window.history.pushState({ productId: product.id_products || product.id }, '', newUrl);
        }
    };

    const closeModal = () => {
        setOpen(false);
        setModalType('');
        // setSelectedProduct(null);
        
        if (modalType === 'view') {
            window.history.pushState({}, '', window.location.pathname);
        }
    };

    // const { '*': wildcard } = useParams();
    // const currentGrandchild = wildcard?.split('/')?.[0] || 'contoh'; // fix: get first segment only

    // Set grandchildItems based on URL (kosongkan jika tidak ada grandchild)
    const grandchild = [];
    useEffect(() => {
        setGrandchildItems(grandchild);
    }, [setGrandchildItems]);

    const renderModalContent = () => {
        switch(modalType) {
            case 'modal':
                return (
                    <div className='bg-white'>Simple modal</div>
                );
            default:
                return <div>Modal content not found</div>;
        }
    };

    return (
        <div className='main_content shadow-lg'>
            <div>
                <p>Template design Erupsi-erp</p>
                <p>Contoh lengkap ada pada selling/ecommerce</p>
                <p>file contoh lengkap berada dalam pages/example</p>
            </div>
            <button onClick={() => openModal("modal")}>Modal</button>
            <Modal isOpen={open} onClose={closeModal} animation="slide">
                {renderModalContent()}
            </Modal>
        </div>
    );
}

export default Example;
