import React, { useEffect } from "react";
//👇🏻 React Router configuration & routes
import { BrowserRouter, Routes, Route } from "react-router-dom";
//👇🏻 React Toastify configuration
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from 'socket.io-client'
import Login from "./components/Login";
import MyPhotos from "./components/MyPhotos";
import Photos from "./components/Photos";
import Register from "./components/Register";
import SharePhoto from "./components/SharePhoto";
import UploadPhoto from "./components/UploadPhoto";


function App() {
  const socket = io.connect("http://localhost:4002");
 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login socket={socket} />} />
          <Route path='/register' element={<Register socket={socket} />} />
          <Route path='/photos' element={<Photos socket={socket} />} />
          <Route
            path='/photo/upload'
            element={<UploadPhoto socket={socket} />}
          />
          <Route path='/user/photos' element={<MyPhotos socket={socket} />} />
          <Route path='/share/:user' element={<SharePhoto socket={socket} />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
