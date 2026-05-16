import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ShoppingCart, Star } from "lucide-react";

const ConsumerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");

    const categories = ["All", "Vegetables", "Fruits", "Dairy", "Bakery", "Meat", "Pantry"];

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            let response;

            if (categoryFilter && categoryFilter !== "All") {
                response = await axios.get(
                    `http://localhost:1234/api/products/category/${categoryFilter}`,
                    {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
            } else {
                response = await axios.get("http://localhost:1234/api/products", {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }

            setProducts(response.data);
        } catch {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [categoryFilter]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleAddToCart = async (productId, quantity) => {
        try {
            setAddingToCart(true);
            await axios.post(
                "http://localhost:1234/api/cart/items",
                { productId, quantity },
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            alert("Added to cart!");
        } catch {
            alert("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleRateProduct = async (productId, score) => {
        try {
            await axios.post(
                "http://localhost:1234/api/recommendations/rate",
                { productId, score },
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            alert("Thanks for rating!");
        } catch {
            alert("Failed to rate product");
        }
    };

    return (
        <div className="consumer-page">
            <div className="page-header-consumer">
                <h1>Fresh Marketplace</h1>

                <div className="category-filters">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-btn ${categoryFilter === cat || (cat === "All" && !categoryFilter)
                                ? "active"
                                : ""
                                }`}
                            onClick={() => setCategoryFilter(cat === "All" ? "" : cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading fresh products...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <p>No products available right now. Please check back later.</p>
                </div>
            ) : (
                <div className="products-grid-consumer">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
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

                                <div className="rating-row">
                                    <span>Rate: </span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className="star-btn"
                                            onClick={() => handleRateProduct(product.id, star)}
                                        >
                                            <Star size={14} />
                                        </button>
                                    ))}
                                </div>

                                <div className="price-row">
                                    <span className="price">₹{product.price.toFixed(2)}</span>

                                    <div className="cart-action-row">
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.availableQuantity}
                                            defaultValue="1"
                                            id={`qty-${product.id}`}
                                            className="qty-input"
                                            style={{ width: '50px', marginRight: '5px' }}
                                        />

                                        <div className="action-buttons-group" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => {
                                                    const qty =
                                                        parseInt(
                                                            document.getElementById(`qty-${product.id}`).value
                                                        ) || 1;
                                                    handleAddToCart(product.id, qty);
                                                }}
                                                disabled={addingToCart || product.availableQuantity <= 0}
                                                className="add-to-cart-btn"
                                                style={{ flex: 1 }}
                                            >
                                                <ShoppingCart size={14} />
                                                Add
                                            </button>

                                            <button
                                                onClick={async () => {
                                                    const qty =
                                                        parseInt(
                                                            document.getElementById(`qty-${product.id}`).value
                                                        ) || 1;
                                                    // Add to cart then redirect to cart page
                                                    await handleAddToCart(product.id, qty);
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsumerDashboard;