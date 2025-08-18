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
            // Updated to use new API endpoint
            const response = await fetch(`http://localhost:4000/internal/products/${productId}`);
            const result = await response.json();
            
            // Handle the new API structure
            if (result.data) {
                // If API returns single product in data field
                const product = Array.isArray(result.data) ? result.data[0] : result.data;
                if (product) {
                    openModal('view', product);
                }
            } else {
                // If product is directly in response
                if (result.id_pos) {
                    openModal('view', result);
                }
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
            const newUrl = `${window.location.pathname}?product=${product.id_pos}`;
            window.history.pushState({ productId: product.id_pos }, '', newUrl);
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
                console.log('Editing product:', selectedProduct?.id_pos, Object.fromEntries(formData));
                break;
            default:
                break;
        }
        closeModal();
    };

    const addToCart = (product) => {
        setCartItems(prev => [...prev, product]);
        console.log('Added to cart:', product);
        // Optionally show a success notification
        alert('Produk berhasil ditambahkan ke keranjang!');
    };

    const copyProductLink = (product) => {
        const link = `${window.location.origin}${window.location.pathname}?product=${product.id_pos}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('Link produk berhasil disalin!');
        }).catch(err => {
            console.error('Failed to copy link:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Link produk berhasil disalin!');
            } catch (err) {
                alert('Gagal menyalin link. Silakan salin manual: ' + link);
            }
            document.body.removeChild(textArea);
        });
    };

    const { '*': wildcard } = useParams();
    const currentGrandchild = wildcard?.split('/')?.[0] || 'emarket';

    // Set grandchildItems based on URL
    useEffect(() => {
        const grandchild = [
            { id: 'emarket', label: 'E-Market' },
            { id: 'statistic', label: 'Statistic' }
        ];
        setGrandchildItems(grandchild);
    }, [setGrandchildItems]);

    // Function to determine animation type based on modal type
    const getModalAnimation = () => {
        switch(modalType) {
            case 'view':
                return 'fade'; // View product modal uses slide animation
            case 'cart':
                return 'slide'; // Cart modal uses slide animation
            case 'add':
                return 'fade';  // Add product modal uses fade animation
            case 'edit':
                return 'fade';  // Edit product modal uses fade animation
            default:
                return 'fade';  // Default animation
        }
    };

    const renderModalContent = () => {
        switch(modalType) {
            case 'add':
                return <AddProductModal closeModal={closeModal} handleSubmit={handleSubmit} />;
            case 'edit':
                return <EditProductModal selectedProduct={selectedProduct} closeModal={closeModal} handleSubmit={handleSubmit} />;
            case 'view':
                return (
                    <ViewProductModal 
                        selectedProduct={selectedProduct} 
                        addToCart={addToCart} 
                        copyProductLink={copyProductLink}
                        closeModal={closeModal}
                    />
                );
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
            <Modal isOpen={open} onClose={closeModal} animation={getModalAnimation()}>
                {renderModalContent()}
            </Modal>
        </div>
    );
}

export default Ecommerce;