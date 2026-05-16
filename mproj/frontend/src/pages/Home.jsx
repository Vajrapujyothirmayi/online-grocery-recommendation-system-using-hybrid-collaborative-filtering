import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Leaf, TrendingUp } from 'lucide-react';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:1234/api/products");
                // Get the first 3 products to display as recommendations
                setRecommendedProducts(response.data.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch products for home page", err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-container">
            <nav className="home-nav">
                <div className="logo-container">
                    <Leaf className="logo-icon" size={28} />
                    <h1>FreshPick Hub</h1>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="nav-link login">Log In</Link>
                    <Link to="/register" className="nav-link signup">Sign Up</Link>
                </div>
            </nav>

            <main className="hero-section">
                <div className="hero-content">
                    <h1>Farm Fresh To Your Doorstep</h1>
                    <p>Experience the best online grocery platform bringing you the highest quality products. Smart recommendations tailored just for you.</p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn primary-btn">Start Shopping</Link>
                    </div>
                </div>

                <div className="hero-image">
                    {/* A beautiful food illustration or mockup would go here typically */}
                    <div className="glass-card mockup-card">
                        <div className="mockup-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <div className="mockup-body">
                            <h3>Recommended for you</h3>
                            <ul>
                                {recommendedProducts.length > 0 ? (
                                    recommendedProducts.map(product => (
                                        <li key={product.id}>
                                            {product.name} <span className="price">₹{product.price.toFixed(2)}</span>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li>Organic Tomatoes <span className="price">₹4.99</span></li>
                                        <li>Fresh Spinach <span className="price">₹2.49</span></li>
                                        <li>Artisan Bread <span className="price">₹5.00</span></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <section className="features-section">
                <div className="feature-card">
                    <div className="feature-icon"><ShoppingCart size={32} /></div>
                    <h3>Easy Shopping</h3>
                    <p>Seamless cart experience with instant checkout options.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><TrendingUp size={32} /></div>
                    <h3>Smart Recommendations</h3>
                    <p>Our advanced AI learns your tastes to suggest the best local produce.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Leaf size={32} /></div>
                    <h3>Fresh Quality</h3>
                    <p>Direct supply from local farms ensures maximum freshness.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
