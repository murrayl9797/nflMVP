import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
const url = 'localhost';

const App = () => {
  const [playerlist, updateList] = useState([]);

  const [teamlist, updateTeams] = useState([]);
  const [selectedTeam, changeTeam] = useState('New England Patriots');

  const [positionlist, updatePositions] = useState([]);
  const [selectedPosition, changePosition] = useState('OLB');

  const getPlayers = () => {
    axios({
      method: 'get',
      url: `http://${url}:4444`,
      params: {
        team: selectedTeam,
        pos: selectedPosition
      }
    })
      .then(res => {
        console.log(res.data.rows);
        updateList(res.data.rows);
      })
      .catch(err => {
        console.log(err);
      })
  };

  const getTeams = () => {
    axios({
      method: 'get',
      url: `http://${url}:4444/teams`
    })
      .then(res => {
        console.log(res.data.rows);
        let teams = res.data.rows;
        teams = teams.map(obj => {
          return obj.team;
        });
        updateTeams(teams);
      })
      .catch(err => {
        console.log(err);
      })
  };

  const getPositions = () => {
    axios({
      method: 'get',
      url: `http://${url}:4444/position`
    })
      .then(res => {
        console.log(res.data.rows);
        let pos = res.data.rows;
        pos = pos.map(obj => {
          return obj.position;
        });
        updatePositions(pos);
      })
      .catch(err => {
        console.log(err);
      })
  };

  useEffect(() => {
    getTeams();
    getPositions();
  }, [1])

  return (
    <div>
      <div>
        Welcome the NFL Fantasy Companion App,
        select a Team to filter players by!
      </div>

      <br/>

      <div>
        Team:
        <select
          value={selectedTeam}
          onChange={e => changeTeam(e.target.value)}
        >
          {teamlist.map((team, ind) => {
            return (
              <option
                value={team}
                key={ind}
              >
                {team}
              </option>
            );
          })
          }
        </select>
      </div>

      {/*<div>
        {selectedTeam}
      </div>*/}

      <div>
        Position:
        <select
          value={selectedPosition}
          onChange={e => changePosition(e.target.value)}
        >
          {positionlist.map((pos, ind) => {
            return (
              <option
                value={pos}
                key={ind}
              >
                {pos}
              </option>
            );
          })
          }
        </select>
      </div>

      {/*<div>
        {selectedPosition}
      </div>*/}

      <br/>

      <div>
        <button
          onClick={() => {
            getPlayers();
          }}
        >
          Get players!
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Current Team</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {playerlist.map((playerObj, ind) => {
            return (
              <tr
                key={ind}
              >
                <td>{playerObj.player}</td>
                <td>{playerObj.team}</td>
                <td>{playerObj.position}</td>
                <td>{playerObj.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;