import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Requests from './API/requests';
import Game from './pages/Game/Game';
import WireConnection from './Puzzles/WireConnection/WireConnection';
import TestNoCanvas from './Puzzles/noCanvas/noCanvas';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Connection = new Requests()

root.render(
  <React.StrictMode>
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
            <Route path="/test/" element={ <div style={{backgroundColor: "white", height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}> <WireConnection count={2}/> {/*<TestNoCanvas />*/} </div> } />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
