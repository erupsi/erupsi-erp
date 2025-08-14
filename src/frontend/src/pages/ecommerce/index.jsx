import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./main.scss";
import Modal from '../../components/modal';
import EMarket from './components/eMarket';
import AddProductModal from './components/modal/addProduct';
import EditProductModal from './components/modal/editProduct';
import ViewProductModal from './components/modal/viewProduct';
import CartModal from './components/modal/cart';

function Ecommerce({ setGrandchildItems }) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
            fetchProductById(productId);
        }
    }, []);

    const fetchProductById = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            const product = await response.json();
            if (product) {
                openModal('view', product);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

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

    useEffect(() => {
        const handlePopState = (event) => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('product');
            
            if (productId && event.state?.productId) {
                fetchProductById(productId);
            } else {
                closeModal();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        switch(modalType) {
            case 'add':
                console.log('Adding new product:', Object.fromEntries(formData));
                break;
            case 'edit':
                console.log('Editing product:', selectedProduct?.id, Object.fromEntries(formData));
                break;
            default:
                break;
        }
        closeModal();
    };

    const addToCart = (product) => {
        setCartItems(prev => [...prev, product]);
        console.log('Added to cart:', product);
    };

    const copyProductLink = (product) => {
        const link = `${window.location.origin}${window.location.pathname}?product=${product.id_products || product.id}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('Product link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy link:', err);
        });
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
            case 'add':
                return <AddProductModal closeModal={closeModal} handleSubmit={handleSubmit} />;
            case 'edit':
                return <EditProductModal selectedProduct={selectedProduct} closeModal={closeModal} handleSubmit={handleSubmit} />;
            case 'view':
                return <ViewProductModal selectedProduct={selectedProduct} addToCart={addToCart} copyProductLink={copyProductLink} />;
            case 'cart':
                return <CartModal cartItems={cartItems} setCartItems={setCartItems} closeModal={closeModal} />;
            default:
                return <div>Modal content not found</div>;
        }
    };

    const renderContent = () => {
        switch (currentGrandchild) {
            case 'emarket':
                return (
                    <EMarket 
                        onEdit={(product) => openModal('edit', product)}
                        onView={(product) => openModal('view', product)}
                        onAddProduct={() => openModal('add')}
                        onOpenCart={() => openModal('cart')}
                        cartItemsCount={cartItems.length}
                    />
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
            <Modal isOpen={open} onClose={closeModal} animation="slide">
                {renderModalContent()}
            </Modal>
        </div>
    );
}

export default Ecommerce;
