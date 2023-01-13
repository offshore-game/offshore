import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Requests from './API/requests';
import Game from './pages/GameLobby/Game';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Connection = new Requests()

root.render(
  <div id="sizingContainer">
    {/* Insert here any graphic to act as the "black side bars" */}
    <div id="sizingWindow">
      <div id="sizingContent">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Home requests={Connection} /> } />
            <Route path="/join" element={ <Home requests={Connection} joinMenu={true}/> } />
            <Route path ="/create" element={ <Home requests={Connection} createMenu={true}/> } />

            <Route path="/lobby/:id" element={ <Home requests={Connection} gameLobby={true}/> } />
            <Route path="/game/:id" element={ <Game requests={Connection} /> } /> {/* Game.tsx needs to be slightly redone to support the new framework. */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
