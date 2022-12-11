import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import PhotoContainer from "./PhotosContainer";

const Photos = ({ socket }) => {
    const navigate = useNavigate()
    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        function authenticateUser() {
            const id = localStorage.getItem("_id");
            /*
            👇🏻 If ID is false, redirects the user to the login page
            */
            if (!id) {
                navigate("/");
            }
        }
        authenticateUser();
    }, [navigate]);

    useEffect(() => {
        const id = localStorage.getItem("_id");
        const email = localStorage.getItem("_myEmail");
        socket.emit('getImages', { id, email })
        socket.on('getImagesSuccess', (images) => {
            console.log(images)
            setPhotos(images)
        })
    }, [socket])
    return (
        <div>
            <Nav />
            <PhotoContainer photos={photos} socket={socket} />
        </div>
    );
};

export default Photos;