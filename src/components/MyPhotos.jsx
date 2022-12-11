import React, { useEffect, useState } from "react";
//👇🏻 React Router configs
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotoContainer from "./Photos/PhotosContainer";
//👇🏻 React-copy-to-clipboard config
import { CopyToClipboard } from "react-copy-to-clipboard";

const MyPhotos = ({ socket }) => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [userLink, setUserLink] = useState("");

    //👇🏻 navigates users to the homepage (for now)
    const handleSignOut = () => {
        localStorage.removeItem("_id");
        localStorage.removeItem("_myEmail");
        navigate("/");
    };

    useEffect(() => {
        function authenticateUser() {
            const id = localStorage.getItem("_id");
            const email = localStorage.getItem("_myEmail");
            if (!id) {
                navigate("/");
            } else {
                //👇🏻 sends the user id to the server
                socket.emit("getMyImages", { id, email });
            }
        }
        authenticateUser();
    }, [navigate, socket]);

    useEffect(() => {
        socket.on('getMyImagesSuccess', (({ images, username }) => {
            setPhotos(images)
            setUserLink(`http://localhost:3004/share/${username}`);
        }))
    }, [socket])

    //👇🏻 This function runs immediately the content is copied
    const copyToClipBoard = () => alert(`Copied ✅`);

    return (
        <div>
            <nav className='navbar'>
                <h3>PhotoShare</h3>

                <div className='nav__BtnGroup'>
                    <Link to='/photo/upload'>Upload Photo</Link>
                    <button onClick={handleSignOut}>Sign out</button>
                </div>
            </nav>

            <div className='copyDiv'>
                <CopyToClipboard
                    text={userLink}
                    onCopy={copyToClipBoard}
                    className='copyContainer'
                >
                    <span className='shareLink'>Copy your share link</span>
                </CopyToClipboard>
            </div>

            <PhotoContainer socket={socket} photos={photos} />
        </div>
    );
};

export default MyPhotos;