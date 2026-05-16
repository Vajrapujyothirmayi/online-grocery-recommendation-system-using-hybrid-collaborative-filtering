import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, MinusCircle, PlusCircle, CreditCard } from 'lucide-react';

const ConsumerCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:1234/api/cart", {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCart(response.data);
        } catch {
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;        }

        try {
            await axios.put(`http://localhost:1234/api/cart/items/${itemId}?quantity=${newQuantity}`, null, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            loadCart(); // Reload cart to get updated totals
        } catch {
            alert('Failed to update quantity');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:1234/api/cart/items/${itemId}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            loadCart();
        } catch {
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        try {
            setCheckingOut(true);
            await axios.post("http://localhost:1234/api/orders/checkout", null, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccess(true);
            setTimeout(() => navigate('/consumer/orders'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) return <div className="loading-state">Loading your cart...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="consumer-page cart-page">
            <div className="page-header-consumer">
                <h1>Your Shopping Cart</h1>
            </div>

            {success && (
                <div className="success-message">
                    Order placed successfully! Redirecting to orders...
                </div>
            )}

            {!cart || !cart.items || cart.items.length === 0 ? (
                <div className="empty-state">
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/consumer')} className="btn btn-primary">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-details">
                                    <h3>{item.productName}</h3>
                                    <p className="item-price">₹{item.price.toFixed(2)} each</p>
                                </div>

                                <div className="item-actions">
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                            className="qty-btn"
                                        >
                                            <MinusCircle size={20} />
                                        </button>
                                        <span className="qty">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                            className="qty-btn"
                                        >
                                            <PlusCircle size={20} />
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>

                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="remove-btn"
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cart.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>₹5.00</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{(cart.totalAmount + 5).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={checkingOut}
                            className="btn btn-primary checkout-btn"
                        >
                            <CreditCard size={20} />
                            {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsumerCart;
