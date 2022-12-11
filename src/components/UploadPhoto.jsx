import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPhoto = ({ socket }) => {
    const navigate = useNavigate();
    const [photoURL, setPhotoURL] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(photoURL);
        const id = localStorage.getItem("_id");
        const email = localStorage.getItem("_myEmail");
        socket.emit('uploadImage', { id, email, photoURL })
    };

    useEffect(() => {
        socket.on('uploadSuccess', ({ message }) => {
            toast.success(message)
            navigate('/photos')
        })
        socket.on('uploadError', message => {
            toast.success(message)
        })
    }, [socket, navigate])

    return (
        <main className='uploadContainer'>
            <div className='uploadText'>
                <h2>Upload Image</h2>
                <form method='POST' onSubmit={handleSubmit}>
                    <label>Paste the image URL</label>
                    <input
                        type='text'
                        name='fileImage'
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                    />
                    <button className='uploadBtn'>UPLOAD</button>
                </form>
            </div>
        </main>
    );
};

export default UploadPhoto;