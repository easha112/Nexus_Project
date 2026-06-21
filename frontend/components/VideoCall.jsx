import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import API from '../services/api';
const socket = io('https://nexus-backend.onrender.com');

const VideoCall = ({ roomId }) => {
    const localVideo = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideo.current.srcObject = stream;
            });
        socket.emit('join-room', roomId);
    }, [roomId]);

    const toggleAudio = () => {
        localVideo.current.srcObject.getAudioTracks()[0].enabled = isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="video-container">
            <video ref={localVideo} autoPlay muted className="w-full h-auto bg-black" />
            <button onClick={toggleAudio} className="bg-red-500 text-white p-2 mt-2">
                {isMuted ? 'Unmute' : 'Mute'}
            </button>
        </div>
    );
};
export default VideoCall;