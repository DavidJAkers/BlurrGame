import { useEffect, useState } from "react";

const game_init = { step: 5, blurlevel: "25px" };

export default function GameControl(props) {
  const { genre, year, index, refreshSettings, addParentHistory } = props;
  const [selected_album, setSelected_Album] = useState({});
  const [hardmode, setHardmode] = useState(false);
  const [dataObject, setDataObject] = useState([]);
  const [url, setUrl] = useState("");
  console.log(url);
  useEffect(() => {
    if (year === 0) {
      return;
    }
    setUrl(
      `https://api.discogs.com/database/search?type=master&genre=${genre}&year=${year}&per_page=9&page=1`
    );
  }, [genre, year]);

  useEffect(() => {
    if (genre === "" || year === 0 || url === "" || index === -1) {
      return;
    }
    // Allows settings calculations to happen in App before passing to AlbumGet
    // This fetch needs an abort controller
    fetch(url, {
      headers: {
        Authorization:
          "Discogs key=SJdGocnZCcCymeDLaWgC, secret=hVVwFIdXbknmrXffmLCdvFUKiQSHaQvf"
      }
    })
      .then((response) => response.json())
      .then((data) => setDataObject(data));
  }, [url]);

  useEffect(() => {
    if (dataObject.length === 0) {
      return;
    }

    const out_image = dataObject.results[index].cover_image;
    const artist_name_pair = dataObject.results[index].title.split("-");
    const out_artist = artist_name_pair[0];
    const out_name = artist_name_pair[1];

    const out_object = {
      name: out_name,
      artist: out_artist,
      year: year,
      genre: genre,
      image: out_image
    };
    setSelected_Album(out_object);
  }, [dataObject]);

  function addGameHistory(input) {
    addParentHistory(input);
  }

  return (
    <div>
      <PlayGame
        selected_album={selected_album}
        refreshSettings={refreshSettings}
      />

      <div className="hardmode">
        <div className="hardmode-text">Hardmode:</div>
        <input
          className="hardmode-checkbox"
          type="checkbox"
          value={hardmode}
          onChange={(e) => setHardmode(e.target.checked)}
        />
      </div>
    </div>
  );

  function PlayGame(props) {
    const { selected_album, refreshSettings } = props;
    const [inputs, setInputs] = useState({});
    const [albumCorrect, setAlbumCorrect] = useState(false);
    const [artistCorrect, setArtistCorrect] = useState(false);
    const [points, setPoints] = useState(0);
    const [gameStep, setGameStep] = useState(game_init);

    console.log(selected_album);

    function NewGame() {
      refreshSettings();
      setGameStep(game_init);
    }

    function handleGuessEntry() {
      let local_albumCorrect = albumCorrect;
      let local_artistCorrect = artistCorrect;
      let local_points = points;
      if (Normalize(inputs.album_name) === Normalize(selected_album.name)) {
        if (albumCorrect === false) {
          local_points += gameStep.step;
        }
        setAlbumCorrect(true);
        local_albumCorrect = true;
      }
      if (Normalize(inputs.artist_name) === Normalize(selected_album.artist)) {
        if (artistCorrect === false) {
          local_points += gameStep.step;
        }
        setArtistCorrect(true);
        local_artistCorrect = true;
      }

      if (local_albumCorrect === true && local_artistCorrect === true) {
        addGameHistory({
          game_won: true,
          game_points: local_points,
          game_album_name: selected_album.name,
          game_artist_name: selected_album.artist,
          blur_level: `${gameStep.step * 20}%`,
          game_type: "normal",
          image: selected_album.image
        });
        NewGame();
      } else if (gameStep.step === 1) {
        addGameHistory({
          game_won: false,
          game_points: local_points,
          game_album_name: selected_album.name,
          game_artist_name: selected_album.artist,
          blur_level: `${gameStep.step * 20}%`,
          game_type: "normal",
          image: selected_album.image
        });
        NewGame();
      } else if (albumCorrect === false || artistCorrect === false) {
        stepPass();
      }
      setPoints(local_points);
      setInputs({});
    }

    function handleHardGuessEntry() {
      let local_albumCorrect;
      let local_artistCorrect;
      let local_points = 0;
      if (Normalize(inputs.album_name) === Normalize(selected_album.name)) {
        if (albumCorrect === false) {
          local_points += gameStep.step;
        }
        local_albumCorrect = true;
      }
      if (Normalize(inputs.artist_name) === Normalize(selected_album.artist)) {
        if (artistCorrect === false) {
          local_points += gameStep.step;
        }
        local_artistCorrect = true;
      }
      if (local_albumCorrect === true && local_artistCorrect === true) {
        addGameHistory({
          game_won: true,
          game_points: local_points,
          game_album_name: selected_album.name,
          game_artist_name: selected_album.artist,
          blur_level: `${gameStep.step * 20}%`,
          game_type: "hard",
          image: selected_album.image
        });
        NewGame();
      } else if (albumCorrect === false || artistCorrect === false) {
        addGameHistory({
          game_won: false,
          game_points: local_points,
          game_album_name: selected_album.name,
          game_artist_name: selected_album.artist,
          blur_level: `${gameStep.step * 20}%`,
          game_type: "hard",
          image: selected_album.image
        });
        NewGame();
      }
      setInputs({});
    }

    function stepPass() {
      if (gameStep.step > 0) {
        setGameStep({
          step: gameStep.step - 1,
          blurlevel: `${(gameStep.step - 1) * 5}px`
        });
      }
    }

    const handleChange = (event) => {
      const { name, value } = event.target;
      setInputs((values) => ({ ...values, [name]: value }));
    };

    return (
      <div>
        <div className="game-info">
          <div>{`Blur level: ${gameStep.step * 20}%`}</div>
          <div>
            {hardmode === true
              ? `Guesses remaining : ${1}`
              : `Guesses remaining: ${gameStep.step}`}
          </div>
        </div>
        <div className="image-container">
          <img
            className="main-image"
            src={selected_album.image}
            alt="Blurred"
            width={240}
            style={{ filter: `blur(${gameStep.blurlevel})` }}
          />
        </div>
        <div className="genre-year">
          <div className="genre">{`Genre: ${selected_album.genre}`}</div>
          <div className="year">{`Year: ${selected_album.year}`}</div>
        </div>
        <div className="points">{`Points: ${points}`}</div>
        <div className="entry-forms">
          <form>
            Album Name:{" "}
            <input
              type="text"
              name="album_name"
              value={
                inputs.album_name || (albumCorrect ? selected_album.name : "")
              }
              onChange={handleChange}
              disabled={albumCorrect}
            ></input>
          </form>
          <form>
            Artist Name:{" "}
            <input
              type="text"
              name="artist_name"
              value={
                inputs.artist_name ||
                (artistCorrect ? selected_album.artist : "")
              }
              onChange={handleChange}
              disabled={artistCorrect}
            ></input>
          </form>
        </div>
        <div className="game-buttons">
          <div>
            <button
              onClick={hardmode ? handleHardGuessEntry : handleGuessEntry}
            >
              Guess
            </button>
          </div>
          <div>
            <button onClick={() => NewGame()}>New Game</button>
          </div>
        </div>
      </div>
    );
  }
}

function Normalize(str) {
  if (str === undefined) {
    return;
  }
  let str_no_innerspaces = str.replace(/\s+/g, "");
  let str_no_outterspaces = str_no_innerspaces.trim();
  let return_str = str_no_outterspaces.toUpperCase();
  return return_str;
}
