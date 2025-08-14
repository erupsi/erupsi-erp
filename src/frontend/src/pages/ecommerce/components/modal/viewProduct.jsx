// src/pages/ecommerce/components/modals/ViewProductModal.jsx
import React from 'react';

function ViewProductModal({ selectedProduct, addToCart, copyProductLink }) {
    return (
        <div className="product-view-modal">
            <div className="product-header">
                <h2>{selectedProduct?.name}</h2>
                <button 
                    className="share-button"
                    onClick={() => copyProductLink(selectedProduct)}
                    title="Copy product link"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                </button>
            </div>
            
            <div className="product-content">
                <div className="product-image">
                    <img 
                        src={`/ecommerce/eMarket/${selectedProduct?.image_url}`} 
                        alt={selectedProduct?.name}
                        className="w-full h-auto rounded-lg"
                    />
                </div>
                
                <div className="product-details">
                    <div className="price-section">
                        <h3 className="text-2xl font-bold">Rp {selectedProduct?.price}</h3>
                    </div>
                    
                    <div className="rating-section">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.38 6.3054C14.2898 6.02136 14.1212 5.76862 13.8935 5.57634C13.6658 5.38406 13.3884 5.26009 13.0933 5.21873L10.6 4.87873L9.47998 2.61206C9.34906 2.3463 9.14635 2.1225 8.8948 1.966C8.64325 1.80951 8.35291 1.72656 8.05665 1.72656C7.76039 1.72656 7.47005 1.80951 7.2185 1.966C6.96695 2.1225 6.76423 2.3463 6.63331 2.61206L5.51331 4.87873L3.01331 5.23873C2.72428 5.28522 2.45364 5.41045 2.23111 5.60066C2.00858 5.79087 1.84275 6.03872 1.75183 6.31699C1.66091 6.59526 1.64841 6.8932 1.71571 7.17811C1.783 7.46302 1.92749 7.72388 2.13331 7.93206L3.93998 9.69206L3.51331 12.2121C3.47338 12.4404 3.48397 12.6747 3.54433 12.8986C3.6047 13.1224 3.71337 13.1303 3.86271 13.5076C4.01205 13.6849 4.19843 13.8273 4.40874 13.9248C4.61904 14.0223 4.84816 14.0726 5.07998 14.0721C5.33748 14.072 5.59121 14.0103 5.81998 13.8921L8.05331 12.7187L10.2866 13.8921C10.5574 14.0315 10.8622 14.0912 11.1656 14.064C11.4689 14.0369 11.7583 13.9241 12 13.7387C12.2289 13.5628 12.4053 13.3274 12.5099 13.0583C12.6145 12.7891 12.6434 12.4965 12.5933 12.2121L12.1666 9.7254L14 7.93206C14.2083 7.72308 14.3543 7.46014 14.4214 7.17279C14.4885 6.88543 14.4742 6.88505 14.38 6.3054Z" fill="#FFC400"/>
                            </svg>
                            <span className="font-medium">{selectedProduct?.avgrating}</span>
                            <span className="text-gray-500">| {selectedProduct?.hassold} terjual</span>
                        </div>
                    </div>
                    
                    <div className="description-section">
                        <h4 className="font-semibold mb-2">Product Description</h4>
                        <p className="text-gray-600">
                            {selectedProduct?.description || "High-quality product with excellent features and great value for money. Perfect for your daily needs and built to last."}
                        </p>
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            className="add-to-cart-btn"
                            onClick={() => addToCart(selectedProduct)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M7 13V9a2 2 0 012-2h6a2 2 0 012 2v4" />
                            </svg>
                            Add to Cart
                        </button>
                        <button 
                            className="buy-now-btn"
                            onClick={() => console.log('Buy now:', selectedProduct)}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProductModal;