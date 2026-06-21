import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Meeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', participants: '' });

  // 1. Fetch all meetings with error handling
  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/meetings');
      setMeetings(data);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, []);

  // 2. Schedule meeting with validation
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return alert("Please fill required fields");
    
    try {
      await API.post('/meetings/schedule', formData);
      alert("Meeting Scheduled Successfully!");
      fetchMeetings(); // Refresh list
      setFormData({ title: '', date: '', time: '', participants: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Conflict detected: Slot unavailable");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Schedule a Meeting</h2>
      
      {/* Form Section */}
      <form onSubmit={handleSchedule} className="bg-gray-100 p-4 rounded shadow-md">
        <input type="text" placeholder="Title" className="w-full p-2 mb-2" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        <input type="date" className="w-full p-2 mb-2" onChange={(e) => setFormData({...formData, date: e.target.value})} required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Book Slot</button>
      </form>

      {/* List Section */}
      <div className="mt-6">
        {loading ? <p>Loading...</p> : meetings.map((m) => (
          <div key={m._id} className="border-b py-2 flex justify-between">
            <span>{m.title} - {new Date(m.date).toLocaleDateString()}</span>
            <span className="text-green-600 font-semibold">{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meeting;