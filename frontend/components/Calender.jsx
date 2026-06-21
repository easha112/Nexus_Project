import React, { useState } from 'react';
import API from '../services/api';

const Calendar = () => {
    const [date, setDate] = useState('');

    const requestMeeting = async () => {
        try {
            await API.post('/meetings/schedule', { date });
            alert("Meeting Request Sent!");
        } catch (err) {
            alert("Conflict: Time slot not available");
        }
    };

    return (
        <div className="p-6">
            <input type="datetime-local" className="border p-2" onChange={(e) => setDate(e.target.value)} />
            <button onClick={requestMeeting} className="bg-purple-600 text-white p-2">Request Meeting</button>
        </div>
    );
};
export default Calendar;