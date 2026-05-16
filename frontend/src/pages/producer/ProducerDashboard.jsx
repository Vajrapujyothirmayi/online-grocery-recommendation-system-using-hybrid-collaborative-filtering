import { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Edit2, Trash2 } from 'lucide-react';

const ProducerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1234/api/products/producer/${user.id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProducts(response.data);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.id) {
            loadProducts();
        }
    }, [user, loadProducts]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:1234/api/products/${id}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                loadProducts(); // Reload list
            } catch {
                alert('Failed to delete product');
            }
        }
    };

    if (loading) return <div>Loading your products...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Products</h1>
                <Link to="/producer/add-product" className="btn btn-primary">Add New Product</Link>
            </div>

            {products.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't added any products yet.</p>
                    <Link to="/producer/add-product" className="btn btn-outline">Add your first product</Link>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} />
                                ) : (
                                    <div className="image-placeholder">No Image</div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="category">{product.category}</p>
                                <div className="price-stock">
                                    <span className="price">₹{product.price.toFixed(2)}</span>
                                    <span className="stock">Stock: {product.availableQuantity}</span>
                                </div>
                            </div>
                            <div className="product-actions">
                                <Link to={`/producer/edit-product/${product.id}`} className="action-btn edit" title="Edit">
                                    <Edit2 size={18} />
                                </Link>
                                <button onClick={() => handleDelete(product.id)} className="action-btn delete" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProducerDashboard;
