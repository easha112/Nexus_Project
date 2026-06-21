import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await API.get('/auth/me'); // Token se current user profile
                setUser(data);
            } catch (err) {
                console.error("Auth error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div className="p-6">
            <h1>Welcome, {user?.name}</h1>
            <p>Role: <span className="font-bold">{user?.role}</span></p>
            {user?.role === 'Investor' ? <InvestorStats /> : <EntrepreneurStats />}
        </div>
    );
};

const InvestorStats = () => <div>Your Investment Portfolio is active.</div>;
const EntrepreneurStats = () => <div>Track your Startup Funding here.</div>;

export default Dashboard;