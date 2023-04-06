import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Requests from './API/requests';
import GameSwitchPoint from './pages/Game/Game';
import Create from './pages/Home/Create/Create';
import Core from './pages/Home/Main/Main';
import Lobby from './pages/Home/Lobby/Lobby';
import Tutorial from './pages/Home/Tutorial/Tutorial';
import Join from './pages/Home/Join/Join';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Cutscene from './components/Cutscene/Cutscene';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Connection = new Requests()

root.render(
  <div id="sizingContainer">
    <div id="sizingWindow">
      <div id="sizingContent">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Core /> } />
            <Route path="/join" element={ <Join requests={Connection} /> } />
            <Route path ="/create" element={ <Create requests={Connection} /> } />
            <Route path ="/tutorial" element={ <Tutorial /> } />

            <Route path="/lobby/:id" element={ <Lobby requests={Connection} /> } />
            <Route path="/game/:id" element={ <GameSwitchPoint requests={Connection} /> } />
            <Route path="/test/" element={ <Cutscene type={"PASS"} leaderboard={[{ username: "a", coins: 200 }, { username: "b", coins: 300 }, { username: "a", coins: 400 }, { username: "a", coins: 500 }, { username: "a", coins: 600 }, { username: "a", coins: 700 }, { username: "a", coins: 800 }, { username: "a", coins: 200 }, { username: "a", coins: 200 }, { username: "a", coins: 200 }, { username: "a", coins: 200 }, { username: "a", coins: 200 }, { username: "a", coins: 200 }, { username: "a", coins: 200 }, ]}/> } />
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
