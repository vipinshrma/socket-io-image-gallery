import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Photos/Nav";
import PhotoContainer from "./Photos/PhotosContainer";
import {useNavigate} from 'react-router-dom'
const SharePhoto = ({ socket }) => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    //👇🏻 This accepts the username from the URL (/share/:user)
    const { user } = useParams();

    return (
        <div>
            <Nav />
            <PhotoContainer socket={socket} photos={photos} />
        </div>
    );
};

export default SharePhoto;