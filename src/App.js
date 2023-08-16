import "./styles.css";
import GameControl from "./GameControl";

import GameStats from "./GameStats";
import { useState, useEffect } from "react";

const GENRE_LIST = ["Pop", "Rock", "Electronic"];
const DECADE_LIST = ["1980's", "1990's", "2000's", "2010's", "2020's"];
const RANDOM_GENRE = GENRE_LIST[RandomIntGenerator(0, GENRE_LIST.length - 1)];
const RANDOM_DECADE =
  DECADE_LIST[RandomIntGenerator(0, DECADE_LIST.length - 1)];
const CURRENT_YEAR = new Date().getFullYear();

export default function App() {
  const [display, setDisplay] = useState(false);
  const [genre, setGenre] = useState(RANDOM_GENRE);
  const [decade, setDecade] = useState(RANDOM_DECADE);
  const [year, setYear] = useState(0);
  const [index, setIndex] = useState(-1);
  const [genreChosen, setGenreChosen] = useState(false);
  const [decadeChosen, setDecadeChosen] = useState(false);
  const [history, setHistory] = useState([]);

  const [dtoYToggle, setDtoYToggle] = useState(false);
  // Toggle used for recalculation of year if decade is chosen by player

  useEffect(() => {
    const parsed = parseFloat(decade);
    const decade_nums = [];
    for (let i = parsed; i < parsed + 10; i++) {
      decade_nums.push(i);
    }
    if (parsed !== 2020) {
      setYear(decade_nums[RandomIntGenerator(0, 9)]);
    } else {
      // Only selects between 2020 and current year
      setYear(decade_nums[RandomIntGenerator(0, CURRENT_YEAR % 10)]);
    }
  }, [genre, decade, dtoYToggle]);

  useEffect(() => {
    setIndex(RandomIntGenerator(0, 7));
  }, []);

  function changeDisplay() {
    setDisplay(!display);
  }

  useEffect(() => {
    //Otherwise occurs on initial load
    if (history.length > 0) {
      setDisplay(true);
    }
  }, [history]);

  function handleGenreChange(e) {
    setGenre(e.target.value);
    setGenreChosen(true);
  }

  function handleDecadeChange(e) {
    setDecade(e.target.value);
    setDecadeChosen(true);
  }

  function refreshSettings() {
    if (!genreChosen) {
      setGenre(GENRE_LIST[RandomIntGenerator(0, GENRE_LIST.length - 1)]);
    }
    if (!decadeChosen) {
      setYear(RandomIntGenerator(1970, CURRENT_YEAR));
    } else {
      setDtoYToggle(!dtoYToggle);
    }
    setIndex(RandomIntGenerator(0, 8));
  }

  function addParentHistory(input) {
    setHistory((values) => [...values, input]);
  }
  //Terrible method I went about, including lots of reduntant code,
  // but would take too much refactoring for now
  if (display === false) {
    return (
      <div className="App">
        <div className="main">
          <div className="header">
            <div className="head-blurr">Blurr </div>
            <button className="headbutton" onClick={changeDisplay}>
              {display ? "Show Game" : "Show Stats"}
            </button>
          </div>

          <div className="game-settings">
            <select name="genre_settings" onChange={handleGenreChange} value="">
              <option value="">{genreChosen ? genre : "Select Genre"}</option>
              {GENRE_LIST.map((genre, index) => (
                <option key={`index-${index}`} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <select
              name="decade_settings"
              onChange={handleDecadeChange}
              value=""
            >
              <option value="">
                {decadeChosen ? decade : "Select Decade"}
              </option>
              {DECADE_LIST.map((decade, index) => (
                <option key={`index-${index}`} value={decade}>
                  {decade}
                </option>
              ))}
            </select>
          </div>

          <GameControl
            genre={genre}
            year={year}
            index={index}
            refreshSettings={refreshSettings}
            addParentHistory={addParentHistory}
          />

          {display === true ? <GameStats history={history} /> : null}
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="main">
          <div className="header">
            <div className="head-blurr">Blurr </div>
            <button className="headbutton" onClick={changeDisplay}>
              {display ? "Show Game" : "Show Stats"}
            </button>
          </div>

          <GameStats history={history} />
        </div>
      </div>
    );
  }
}

//both inclusive
function RandomIntGenerator(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
