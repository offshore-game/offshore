import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './pages/Home/Home'
import JoinGame from './pages/JoinGame/JoinGame';
import CreateGame from './pages/CreateGame/CreateGame';
import Requests from './API/requests';
import Game from './pages/GameLobby/Game';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Connection = new Requests()

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home requests={Connection} />} /> {/* add page type ({ main, join, create }) prop later */}
      <Route path="/join" element = {<JoinGame requests={Connection} />} />
      <Route path ="/create" element = {<CreateGame requests={Connection} />} />

      <Route path="/game/:id" element={ <Game requests={Connection} /> } />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
