import React, { useState } from 'react';
import API from '../services/api';

const Payment = () => {
    const [amount, setAmount] = useState('');

    const handleTransaction = async (type) => {
        try {
            await API.post('/payments/transfer', { amount, type });
            alert(`${type} successful!`);
        } catch (err) {
            alert("Transaction failed: " + err.response?.data?.message);
        }
    };

    return (
        <div className="p-6">
            <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} className="p-2 border" />
            <button onClick={() => handleTransaction('deposit')} className="bg-green-600 text-white p-2 ml-2">Deposit</button>
            <button onClick={() => handleTransaction('withdraw')} className="bg-red-600 text-white p-2 ml-2">Withdraw</button>
        </div>
    );
};
export default Payment;