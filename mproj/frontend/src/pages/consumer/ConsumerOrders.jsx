import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Calendar, DollarSign, ListOrdered } from 'lucide-react';

const ConsumerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:1234/api/orders", {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(response.data);
        } catch {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) return <div className="loading-state">Loading your order history...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="consumer-page orders-page">
            <div className="page-header-consumer">
                <h1>Order History</h1>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">Order #"${order.id}"</span>
                                    <div className="order-meta">
                                        <Calendar size={14} />
                                        {new Date(order.orderDate).toLocaleString()}
                                    </div>
                                </div>
                                <div className="order-total-block">
                                    <span className="total-label">Total Amount:</span>
                                    <span className="total-value">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="order-items-list">
                                <h4><ListOrdered size={16} /> Items in this order</h4>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.id} className="order-item-detail">
                                            <span className="item-name">{item.productName}</span>
                                            <span className="item-qty">x{item.quantity}</span>
                                            <span className="item-subtotal">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="order-footer">
                                <span className="status completed">Completed</span>
                                <button className="btn btn-outline small-btn">View Invoice</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsumerOrders;
