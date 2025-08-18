import React from 'react';
import "./viewProduct.scss";

function ViewProductModal({ selectedProduct, addToCart, copyProductLink, closeModal }) {
    if (!selectedProduct) {
        return <div>Loading...</div>;
    }

    const handleAddToCart = () => {
        addToCart(selectedProduct);
        // Optionally show a success message or keep modal open
    };

    const handleCopyLink = () => {
        copyProductLink(selectedProduct);
    };

    return (
        <div className="modal-container">
            <div className="view-product-modal bg-red-500">
                <div className="modal-header">
                    <h2>Detail Produk</h2>
                    <button 
                        className="close-btn"
                        onClick={closeModal}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="product-image">
                        <img 
                            src={`/ecommerce/eMarket/${selectedProduct.productimage || 'default.jpg'}`} 
                            alt="Product"
                            onError={(e) => {
                                e.target.src = '/ecommerce/eMarket/default.jpg';
                            }}
                        />
                    </div>
                    
                    <div className="product-details">
                        <div className="product-info">
                            <h3>Product Name</h3> {/* You may need to add name field from API */}
                            <p className="price">Rp {selectedProduct.price?.toLocaleString('id-ID') || 'N/A'}</p>
                            
                            <div className="rating-info">
                                <div className="rating">
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.38 6.3054C14.2898 6.02136 14.1212 5.76862 13.8935 5.57634C13.6658 5.38406 13.3884 5.26009 13.0933 5.21873L10.6 4.87873L9.47998 2.61206C9.34906 2.3463 9.14635 2.1225 8.8948 1.966C8.64325 1.80951 8.35291 1.72656 8.05665 1.72656C7.76039 1.72656 7.47005 1.80951 7.2185 1.966C6.96695 2.1225 6.76423 2.3463 6.63331 2.61206L5.51331 4.87873L3.01331 5.23873C2.72428 5.28522 2.45364 5.41045 2.23111 5.60066C2.00858 5.79087 1.84275 6.03872 1.75183 6.31699C1.66091 6.59526 1.64841 6.8932 1.71571 7.17811C1.783 7.46302 1.92749 7.72388 2.13331 7.93206L3.93998 9.69206L3.51331 12.2121C3.47338 12.4404 3.48397 12.6747 3.54433 12.8986C3.6047 13.1224 3.71337 13.1303 3.86271 13.5076C4.01205 13.6849 4.19843 13.8273 4.40874 13.9248C4.61904 14.0223 4.84816 14.0726 5.07998 14.0721C5.33748 14.072 5.59121 14.0103 5.81998 13.8921L8.05331 12.7187L10.2866 13.8921C10.5574 14.0315 10.8622 14.0912 11.1656 14.064C11.4689 14.0369 11.7583 13.9241 12 13.7387C12.2289 13.5628 12.4053 13.3274 12.5099 13.0583C12.6145 12.7891 12.6434 12.4965 12.5933 12.2121L12.1666 9.7254L14 7.93206C14.2083 7.72308 14.3543 7.46014 14.4214 7.17279C14.4885 6.88543 14.4742 6.88505 14.38 6.3054Z" fill="#FFC400"/>
                                    </svg>
                                    <span>{selectedProduct.avg_rating || '0'}</span>
                                </div>
                                <span className="sold">| {selectedProduct.total_sold || 0} terjual</span>
                            </div>
                        </div>
                        
                        <div className="product-meta">
                            <div className="availability">
                                <span className={`status ${selectedProduct.isavailable ? 'available' : 'unavailable'}`}>
                                    {selectedProduct.isavailable ? 'Tersedia' : 'Tidak Tersedia'}
                                </span>
                                <span className="stock">Stok: {selectedProduct.quantity || 0}</span>
                            </div>
                            
                            <div className="product-id">
                                <small>ID: {selectedProduct.id_pos}</small>
                            </div>
                            
                            <div className="dates">
                                <small>Dibuat: {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString('id-ID') : 'N/A'}</small>
                                <small>Diperbarui: {selectedProduct.updated_at ? new Date(selectedProduct.updated_at).toLocaleDateString('id-ID') : 'N/A'}</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary"
                        onClick={handleCopyLink}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Salin Link
                    </button>
                    
                    <button 
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                        disabled={!selectedProduct.isavailable || selectedProduct.quantity === 0}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.2502 8.99999C7.2502 8.58578 7.58599 8.24999 8.0002 8.24999H11.0002C11.4144 8.24999 11.7502 8.58578 11.7502 8.99999C11.7502 9.4142 11.4144 9.74999 11.0002 9.74999H8.0002C7.58599 9.74999 7.2502 9.4142 7.2502 8.99999Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.28869 2.76282C1.41968 2.36986 1.84442 2.15749 2.23737 2.28848L2.54176 2.38994C3.16813 2.5987 3.69746 2.77513 4.1137 2.96876C4.55613 3.17459 4.94002 3.42968 5.23112 3.83355C5.52222 4.23743 5.64282 4.68229 5.69817 5.16711C5.70129 5.19437 5.70421 5.222 5.70696 5.24999L16.511 5.24999C17.4869 5.24995 18.3034 5.24992 18.9278 5.34236C19.5793 5.4388 20.2076 5.66048 20.6038 6.26138C21 6.86229 20.9563 7.5271 20.7883 8.16384C20.6273 8.77419 20.3057 9.52462 19.9212 10.4216L19.4544 11.5109C19.2778 11.923 19.1224 12.2855 18.961 12.5725C18.7862 12.8832 18.5728 13.1653 18.2497 13.3784C17.9266 13.5914 17.5832 13.6764 17.2288 13.7147C16.9014 13.75 16.507 13.75 16.0587 13.75H6.15378C6.22758 13.8839 6.31252 13.9943 6.40921 14.091C6.68598 14.3677 7.07455 14.5482 7.80832 14.6468C8.56367 14.7484 9.56479 14.75 11.0002 14.75H19.0002C19.4144 14.75 19.7502 15.0858 19.7502 15.5C19.7502 15.9142 19.4144 16.25 19.0002 16.25H10.9453C9.57776 16.25 8.47541 16.25 7.60845 16.1335C6.70834 16.0125 5.95047 15.7536 5.34855 15.1516C4.74664 14.5497 4.48774 13.7918 4.36673 12.8917C4.25017 12.0248 4.25018 10.9225 4.2502 9.55487L4.2502 6.88303C4.2502 6.17003 4.24907 5.69826 4.20785 5.33726C4.16883 4.99541 4.10068 4.83052 4.01426 4.71062C3.92784 4.59072 3.79296 4.47392 3.481 4.3288C3.15155 4.17554 2.70435 4.02527 2.02794 3.79981L1.76303 3.7115C1.37008 3.58052 1.15771 3.15578 1.28869 2.76282ZM5.80693 12.25H16.022C16.5179 12.25 16.8305 12.249 17.0678 12.2234C17.287 12.1997 17.3713 12.1608 17.424 12.1261C17.4766 12.0914 17.5455 12.0292 17.6537 11.8371C17.7707 11.629 17.8948 11.3421 18.0901 10.8863L18.5187 9.88631C18.9332 8.91911 19.2087 8.2713 19.3379 7.78124C19.4636 7.30501 19.3999 7.16048 19.3515 7.08712C19.3032 7.01376 19.1954 6.89831 18.7082 6.82619C18.2068 6.75196 17.5029 6.74999 16.4506 6.74999H5.7502C5.75021 6.78023 5.75021 6.81069 5.7502 6.84138L5.7502 9.49999C5.7502 10.672 5.75127 11.5544 5.80693 12.25Z" fill="currentColor"/>
                        </svg>
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewProductModal;