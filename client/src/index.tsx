import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import JoinGame from './pages/JoinGame/JoinGame';
import CreateGame from './pages/CreateGame/CreateGame';
import Auth from './components/auth/auth';
import Requests from './API/requests';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Connection = new Requests()

root.render(
  <React.StrictMode>
    <Auth requests={Connection}/> {/* This is probably a bad idea, it keeps running once for each route, creating duplicate authentications. */}
    <BrowserRouter>
      <Routes>
        {/* IDEA: For token authentication, prevent react router from working until we've established a connection. From there, pass down `socket` to each component. (make socket in index.tsx)*/}
        <Route path="/" element={<Home />} /> {/* add page type ({ main, join, create }) prop later */}
        <Route path="/join" element = {<JoinGame />}/>
        <Route path ="/create" element = {<CreateGame />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
