import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Package, PlusCircle, LogOut } from 'lucide-react';
import './Producer.css';

const ProducerLayout = () => {
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
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Producer Panel</h2>
                    <p>Welcome, {user?.username}</p>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/producer" className={`nav-item ${isActive('/producer')}`}>
                        <Package size={20} />
                        My Products
                    </Link>
                    <Link to="/producer/add-product" className={`nav-item ${isActive('/producer/add-product')}`}>
                        <PlusCircle size={20} />
                        Add Product
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default ProducerLayout;
