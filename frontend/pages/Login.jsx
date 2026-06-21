import React, { useState } from 'react';
import API from '../services/api';

const Login = () => {
    const [creds, setCreds] = useState({ email: '', password: '' });

    const login = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', creds);
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            alert(err.response?.data?.message || "Login Error");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={login} className="p-8 border shadow-xl rounded">
                <h2 className="text-xl mb-4">Login to Nexus</h2>
                <input type="email" placeholder="Email" className="block w-full p-2 mb-2 border" onChange={(e) => setCreds({...creds, email: e.target.value})} />
                <input type="password" placeholder="Password" className="block w-full p-2 mb-4 border" onChange={(e) => setCreds({...creds, password: e.target.value})} />
                <button className="w-full bg-black text-white p-2">Sign In</button>
            </form>
        </div>
    );
};
export default Login;