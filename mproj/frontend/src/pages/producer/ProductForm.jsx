import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        availableQuantity: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageData = new FormData();
        imageData.append('file', file);

        setUploadingImage(true);
        try {
            const response = await axios.post('http://localhost:1234/api/files/upload', imageData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setFormData(prev => ({
                ...prev,
                imageUrl: response.data.url
            }));
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        if (isEditing) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`http://localhost:1234/api/products/${id}`, {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    const product = response.data;
                    setFormData({
                        name: product.name,
                        description: product.description || '',
                        price: product.price,
                        category: product.category,
                        imageUrl: product.imageUrl || '',
                        availableQuantity: product.availableQuantity
                    });
                } catch {
                    setError('Failed to load product details');
                }
            };
            fetchProduct();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Convert string inputs back to numbers if needed, though forms send strings. 
        // The API might handle it, but it's safer to cast.
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            availableQuantity: parseInt(formData.availableQuantity, 10)
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:1234/api/products/${id}`, payload, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post("http://localhost:1234/api/products", payload, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            navigate('/producer');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <div className="form-container">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label>Product Name <span className="required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Organic Apples"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Price (₹) <span className="required">*</span></label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                            />
                        </div>

                        <div className="form-group half">
                            <label>Available Quantity <span className="required">*</span></label>
                            <input
                                type="number"
                                name="availableQuantity"
                                min="0"
                                value={formData.availableQuantity}
                                onChange={handleChange}
                                required
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Category <span className="required">*</span></label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Bakery">Bakery</option>
                                <option value="Meat">Meat & Poultry</option>
                                <option value="Pantry">Pantry</option>
                            </select>
                        </div>

                        <div className="form-group half">
                            <label>Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />
                            {uploadingImage && <small style={{color: '#666'}}>Uploading image...</small>}
                            {formData.imageUrl && (
                                <div style={{marginTop: '10px'}}>
                                    <img src={formData.imageUrl} alt="Preview" style={{maxWidth: '100px', borderRadius: '4px'}} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe your product..."
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/producer')}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
