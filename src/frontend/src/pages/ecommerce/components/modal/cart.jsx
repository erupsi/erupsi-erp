// src/pages/ecommerce/components/modals/CartModal.jsx
import React from 'react';

function CartModal({ cartItems, setCartItems, closeModal }) {
    return (
        <div>
            <h2>Shopping Cart ({cartItems.length})</h2>
            <div className="cart-content">
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div>
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item flex items-center gap-4 p-3 border-b">
                                <img 
                                    src={`/ecommerce/eMarket/${item.image_url}`} 
                                    alt={item.name} 
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-gray-600">Rp {item.price}</p>
                                </div>
                                <button 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setCartItems(prev => prev.filter((_, i) => i !== index))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="cart-total mt-4 p-3 bg-gray-50 rounded">
                            <div className="flex justify-between items-center font-bold">
                                <span>Total: </span>
                                <span>Rp {cartItems.reduce((sum, item) => sum + parseInt(item.price), 0)}</span>
                            </div>
                        </div>
                        <div className="form-actions mt-4">
                            <button type="button" onClick={closeModal}>Continue Shopping</button>
                            <button type="button" className="checkout-btn">Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartModal;
        