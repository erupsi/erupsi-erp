// src/pages/ecommerce/components/modals/EditProductModal.jsx
import React from 'react';

function EditProductModal({ selectedProduct, closeModal, handleSubmit }) {
    return (
        <div>
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input 
                        name="name" 
                        defaultValue={selectedProduct?.name}
                        placeholder="Enter product name" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input 
                        name="price" 
                        type="number" 
                        defaultValue={selectedProduct?.price}
                        placeholder="Enter price" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Image URL</label>
                    <input 
                        name="image_url" 
                        defaultValue={selectedProduct?.image_url}
                        placeholder="Enter image URL" 
                        required 
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={closeModal}>Cancel</button>
                    <button type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    );
}

export default EditProductModal;