import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./main.scss";
import Modal from '../../components/modal';

function Example({ setGrandchildItems }) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
            fetchProductById(productId);
        }
    }, []);

    const openModal = (type, product = null) => {
        setModalType(type);
        setSelectedProduct(product);
        setOpen(true);
        
        if (type === 'view' && product) {
            const newUrl = `${window.location.pathname}?product=${product.id_products || product.id}`;
            window.history.pushState({ productId: product.id_products || product.id }, '', newUrl);
        }
    };

    const closeModal = () => {
        setOpen(false);
        setModalType('');
        setSelectedProduct(null);
        
        if (modalType === 'view') {
            window.history.pushState({}, '', window.location.pathname);
        }
    };

    const { '*': wildcard } = useParams();
    const currentGrandchild = wildcard?.split('/')?.[0] || 'emarket'; // fix: get first segment only

    // Set grandchildItems based on URL
    useEffect(() => {
        const grandchild = [
            { id: 'emarket', label: 'E-Market' },
            { id: 'statistic', label: 'Statistic' }
        ];
        setGrandchildItems(grandchild);
    }, [setGrandchildItems]);

    const renderModalContent = () => {
        switch(modalType) {
            case 'Modal1':
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">Modal 1</h2>
                        <p>Contoh penggunaan modal 1.</p>
                    </div>
                );
            case 'modal2':
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">Modal 2</h2>
                        <p>Contoh penggunaan perbedaan modal 2.</p>
                    </div>
                );
            default:
                return <div>Modal content not found</div>;
        }
    };

    const renderContent = () => {
        switch (currentGrandchild) {
            case 'emarket':
                return (
                    <div className="p-4">
                        <h1 className="text-2xl font-bold">Emarket</h1>
                        <p>This is the dummy statistic view.</p>
                    </div>
                );
            case 'statistic':
                return (
                    <div className="p-4">
                        <h1 className="text-2xl font-bold">Statistic</h1>
                        <p>This is the dummy statistic view.</p>
                    </div>
                );
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className='main_content shadow-lg'>
            {renderContent()}
            <button onClick={() => openModal("Modal1")}>Modal satu</button>
            <button onClick={() => openModal("modal2")}>Modal dua </button>
            <Modal isOpen={open} onClose={closeModal} animation="slide">
                {renderModalContent()}
            </Modal>
        </div>
    );
}

export default Example;
