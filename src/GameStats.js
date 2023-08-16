import { useEffect, useState } from "react";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function GameStats(props) {
  const { history } = props;
  const [wLmessage, setWLmessage] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [points, setPoints] = useState(0);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    if (history.length === 0) {
      return;
    }
    let last = history[history.length - 1];
    if (last.game_won) {
      setWLmessage({ message: "You Won!", color: "green" });
    } else {
      setWLmessage({ message: "You Lost", color: "red" });
    }
    setImage(last.image);
    setName(last.game_album_name);
    setArtist(last.game_artist_name);
    setPoints(last.game_points);
  }, [history]);
  function CalculateWinStreak() {
    if (history.length === 0) {
      return 0;
    }
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].game_won === true) {
        count += 1;
      } else {
        return count;
      }
    }
    return count;
  }

  function TotalWon() {
    if (history.length === 0) {
      return 0;
    }
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].game_won === true) {
        count += 1;
      }
    }
    return count;
  }

  function CalculateWinPercent() {
    if (history.length === 0) {
      return 0;
    }
    let total_count = 0;
    let win_count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      total_count += 1;
      if (history[i].game_won === true) {
        win_count += 1;
      }
    }
    return Math.floor((win_count / total_count) * 100);
  }

  function calculateData() {
    if (showData === false) {
      for (let i = 0; i < history.length; i++) {
        setData((values) => [
          ...values,
          {
            name: history[i].game_album_name,
            points: history[i].game_points
          }
        ]);
      }
    } else {
      setData([]);
    }
    setShowData(!showData);
  }
  /*
  let data_test = [
    { name: "the album", points: 9, won: true, game_type: "normal" },
    { name: "hard", points: 2, won: false, game_type: "hard" },
    { name: "haha", points: 5, won: true, game_type: "normal" }
  ];
  */
  return (
    <div className="stats">
      <h2 className="stats_h2">Statistics </h2>
      <div className="winmessage" style={{ color: wLmessage.color }}>
        {history.length > 0 ? `${wLmessage.message} - ${points}` : ""}
      </div>
      <div className="image">
        {history.length > 0 ? (
          <img src={image} alt="" width={150} height={150} />
        ) : (
          ""
        )}
      </div>
      <div className="name_artist">
        {history.length > 0 ? `${name} - ${artist}` : ""}
      </div>
      <hr />
      <h2 className="history_header">Game History</h2>
      <div className="history_stats">
        {history.length > 0
          ? `Played: ${
              history.length
            } Won: ${TotalWon()} Win%: ${CalculateWinPercent()} Win Streak: ${CalculateWinStreak()}`
          : "No game history recorded"}
      </div>
      <br />
      {/*
      <div>
        {history.length > 0 ? (
          <button onClick={calculateData}>Show Data Chart</button>
        ) : (
          ""
        )}
      </div>
    
      {showData ? (
        <div className="barchart">
          <BarChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            layout={"vertical"}
          >
            <XAxis doman={[0, 10]} type="number" />
            <YAxis tickLine={false} type="category" dataKey="name" />

            <Tooltip />
            <Bar dataKey="points" fill="#8884d8" />
          </BarChart>
        </div>
      ) : (
        ""
      )}
      */}
    </div>
  );
}
