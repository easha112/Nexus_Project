import React, { useState } from 'react';
import API from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Entrepreneur' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/auth/register', formData);
            alert("Registration successful! Please login.");
            window.location.href = '/login';
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 border rounded shadow-lg">
            <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required className="block w-full p-2 mb-4 border" />
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required className="block w-full p-2 mb-4 border" />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required className="block w-full p-2 mb-4 border" />
            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 w-full">{loading ? 'Processing...' : 'Register'}</button>
        </form>
    );
};
export default Register;