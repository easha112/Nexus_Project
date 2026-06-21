import React, { useState } from 'react';
import API from '../services/api';

const Documents = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Select a file first");
        setUploading(true);
        const fd = new FormData();
        fd.append('document', file);

        try {
            await API.post('/docs/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert("Document uploaded successfully");
        } catch (err) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={uploading} className="bg-green-500 text-white p-2">
                {uploading ? 'Uploading...' : 'Upload Doc'}
            </button>
        </div>
    );
};
export default Documents;