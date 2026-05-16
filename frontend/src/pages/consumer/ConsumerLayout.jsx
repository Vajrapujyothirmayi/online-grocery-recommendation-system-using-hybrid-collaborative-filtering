import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag, ShoppingCart, Clock, Star, LogOut } from 'lucide-react';
import './Consumer.css';

const ConsumerLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="consumer-layout">
            <header className="consumer-header">
                <div className="header-brand">
                    <h2>FreshPick Hub</h2>
                </div>

                <nav className="header-nav">
                    <Link to="/consumer" className={`nav-link ${isActive('/consumer')}`}>
                        <ShoppingBag size={20} />
                        Shop
                    </Link>
                    <Link to="/consumer/recommendations" className={`nav-link ${isActive('/consumer/recommendations')}`}>
                        <Star size={20} />
                        For You
                    </Link>
                    <Link to="/consumer/cart" className={`nav-link ${isActive('/consumer/cart')}`}>
                        <ShoppingCart size={20} />
                        Cart
                    </Link>
                    <Link to="/consumer/orders" className={`nav-link ${isActive('/consumer/orders')}`}>
                        <Clock size={20} />
                        Orders
                    </Link>
                </nav>

                <div className="header-user">
                    <span className="welcome-text">Hi, {user?.username}</span>
                    <button onClick={handleLogout} className="logout-btn-header" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="consumer-content">
                <Outlet />
            </main>
        </div>
    );
};

export default ConsumerLayout;
