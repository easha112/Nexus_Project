import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Profile = () => {
    const [profile, setProfile] = useState({ bio: '', history: '' });

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            await API.put('/user/update', profile);
            alert("Profile Updated!");
        } catch (err) {
            alert("Update Failed");
        }
    };

    return (
        <form onSubmit={updateProfile} className="max-w-md p-4">
            <textarea placeholder="Bio" className="w-full border p-2" onChange={(e) => setProfile({...profile, bio: e.target.value})} />
            <button className="bg-blue-500 text-white p-2 mt-2">Save Profile</button>
        </form>
    );
};
export default Profile;