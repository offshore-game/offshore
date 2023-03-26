import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Requests from './API/requests';
import GameSwitchPoint from './pages/Game/Game';
import ButtonSpeed from './Puzzles/ButtonSpeed/Puzzle/ButtonSpeed';
import Create from './pages/Home/Create/Create';
import Core from './pages/Home/Core/Core';
import Lobby from './pages/Home/Lobby/Lobby';
import Tutorial from './pages/Home/Tutorial/Tutorial';
import Join from './pages/Home/Join/Join';
import Cutscene from './components/Cutscene/Cutscene';

const buttonSpeedPayload = { // testing purposes only

  standard: {
      0: [ 2, 5, 10 ], // At 2, 5, and 10 seconds after start
      1: [ 3, 6, 11 ],
      2: [ 3, 6, 9 ],
      3: [ 6, 9, 12 ],
      4: [ 6, 9, 12 ],
      10: [ 2, 5, 15 ],
  },

  poison: { // If a button is poison, it CANNOT be a normal button as well.

      5: [ 7 ]

  },

  duration: 15, // The time the game goes on

  timeToHit: 2, // NOTE: At minimum there must be a 1 second buffer + timeToHit between buttons lighting up

}

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
            <Route path="/" element={ <Core /> } />
            <Route path="/join" element={ <Join requests={Connection} /> } />
            <Route path ="/create" element={ <Create requests={Connection} /> } />
            <Route path ="/tutorial" element={ <Tutorial /> } />

            <Route path="/lobby/:id" element={ <Lobby requests={Connection} /> } />
            <Route path="/game/:id" element={ <GameSwitchPoint requests={Connection} /> } /> {/* Game.tsx needs to be slightly redone to support the new framework. */}
            <Route path="/test/" element={ <Cutscene type={"FAIL"}/> } />
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
