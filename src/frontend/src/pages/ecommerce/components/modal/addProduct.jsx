// src/pages/ecommerce/components/modals/AddProductModal.jsx
import React from 'react';

function AddProductModal({ closeModal, handleSubmit }) {
    return (
        <div className='bg-white'>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input 
                        name="name" 
                        placeholder="Enter product name" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input 
                        name="price" 
                        type="number" 
                        placeholder="Enter price" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Image URL</label>
                    <input 
                        name="image_url" 
                        placeholder="Enter image URL" 
                        required 
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={closeModal}>Cancel</button>
                    <button type="submit">Add Product</button>
                </div>
            </form>
        </div>
    );
}

export default AddProductModal;