import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConsumerRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:1234/api/recommendations", {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data && response.data.length > 0) {
                setRecommendations(response.data);
            } else {
                // Fallback for new users
                const allProductsResponse = await axios.get("http://localhost:1234/api/products", {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRecommendations(allProductsResponse.data.slice(0, 10)); // Recommend top 10 general products
            }
        } catch {
            // If the recommendations API fails (e.g., Python service down), fallback to general products too
            try {
                const allProductsResponse = await axios.get("http://localhost:1234/api/products", {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRecommendations(allProductsResponse.data.slice(0, 10));
            } catch {
                setError('Failed to load personalized recommendations');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecommendations();
    }, []);

    const handleAddToCart = async (productId) => {
        try {
            setAddingToCart(true);
            await axios.post("http://localhost:1234/api/cart/items", { productId, quantity: 1 }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert("Added to cart!");
        } catch {
            alert("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleRateProduct = async (productId, score) => {
        try {
            await axios.post("http://localhost:1234/api/recommendations/rate", { productId, score }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert(`Rated ${score} stars!`);
            // Optionally reload recommendations as rating might change them
        } catch {
            alert("Failed to rate product");
        }
    };

    if (loading) return <div className="loading-state">Curating your personalized list...</div>;

    return (
        <div className="consumer-page">
            <div className="page-header-consumer">
                <div className="header-title-wrapper">
                    <Star className="header-icon" size={28} />
                    <h1>Recommended For You</h1>
                </div>
            </div>

            <div className="recommendations-hero">
                <p>Based on your purchase history, ratings, and product preferences, our hybrid recommendation engine has carefully selected these items just for you.
                    Discover your next favorite local produce through collaborative filtering and content-based matching!</p>
                <div className="recommendation-features">
                    <span className="feature-badge">🤝 Collaborative Filtering</span>
                    <span className="feature-badge">📦 Content-Based Matching</span>
                    <span className="feature-badge">⭐ Personal Ratings</span>
                </div>
            </div>

            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="products-grid-consumer">
                    {recommendations.map((product, index) => (
                        <div key={product.id} className="product-card featured-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="recommendation-badge">Top Pick</div>
                            <div className="product-image">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} />
                                ) : (
                                    <div className="image-placeholder">No Image</div>
                                )}
                                {product.availableQuantity <= 0 && (
                                    <div className="out-of-stock-overlay">Out of Stock</div>
                                )}
                            </div>
                            <div className="product-info">
                                <div className="product-header">
                                    <h3>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                </div>

                                <p className="producer-name">By {product.producerName}</p>
                                <p className="product-desc">{product.description}</p>

                                <div className="rating-row compact">
                                    <span>Rate: </span>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            className="star-btn"
                                            onClick={() => handleRateProduct(product.id, star)}
                                            title={`Rate ${star} stars`}
                                        >
                                            <Star size={14} className="star-icon" />
                                        </button>
                                    ))}
                                </div>

                                <div className="price-row">
                                    <span className="price">₹{product.price.toFixed(2)}</span>

                                    <div className="action-buttons-group" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            disabled={addingToCart || product.availableQuantity <= 0}
                                            className="add-to-cart-btn"
                                            style={{ flex: 1 }}
                                        >
                                            <ShoppingCart size={14} />
                                            Add
                                        </button>

                                        <button
                                            onClick={async () => {
                                                await handleAddToCart(product.id);
                                                window.location.href = '/consumer/cart';
                                            }}
                                            disabled={addingToCart || product.availableQuantity <= 0}
                                            className="btn primary-btn buy-now-btn"
                                            style={{ flex: 1, padding: '8px 10px', fontSize: '0.9rem' }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsumerRecommendations;
