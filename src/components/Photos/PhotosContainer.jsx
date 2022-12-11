import React, { useEffect } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import { toast } from "react-toastify";

const PhotoContainer = ({ photos, socket }) => {
    const handleUpvote = (id) => {

        console.log("Upvote", id);
        socket.emit('upvote', { email: localStorage.getItem("_myEmail"), photoId: id })
    };

    useEffect(() => {
        socket.on('upvoteSuccess', ({ message, item }) => {
            console.log("item vot==>", item)
            toast.success(message)
        })
        socket.on('upvoteError', ({ error_message }) => {
            toast.success(error_message)
        })
    }, [socket])

    return (
        <main className='photoContainer'>
            {photos.map((photo) => (
                <div className='photo' key={photo.id}>
                    <div className='imageContainer'>
                        <img
                            src={photo.image_url}
                            alt={photo.id}
                            className='photo__image'
                        />
                    </div>

                    <button className='upvoteIcon' onClick={() => handleUpvote(photo.id)}>
                        <MdOutlineArrowUpward
                            style={{ fontSize: "20px", marginBottom: "5px" }}
                        />
                        <p style={{ fontSize: "12px", color: "#ce7777" }}>
                            {photo.vote_count}
                        </p>
                    </button>
                </div>
            ))}
        </main>
    );
};

export default PhotoContainer;