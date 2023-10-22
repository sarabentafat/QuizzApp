import "./App.css";
import Menu from "./components/Menu";
import Quiz from "./components/Quiz";
import EndScreen from "./components/EndScreen";
import { useState } from "react";
import { GameStateContext } from "./helpers/Contexts";
import { Auth } from "./components/Auth";
import { Welcome } from "./components/Welcome";
import Winners from "./components/Winners";
// ['menu', 'playing', 'finished']
function App() {
  const [gameState, setGameState] = useState("menu");
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);

  return (
    <div className="App bg-black text-white">
      <h1>Card App</h1>
      <GameStateContext.Provider
        value={{
          gameState,
          setGameState,
          userName,
          setUserName,
          score,
          setScore,
        }}
      >
        {gameState === "menu" && <Menu />}
        {gameState == "welcome" && <Welcome />}
        {gameState === "auth" && <Auth />}
        {gameState === "playing" && <Quiz />}
        {gameState === "finished" && <EndScreen />}
        {gameState === "winners" && <Winners />}
      </GameStateContext.Provider>
      {/* <Winners/> */}
    </div>
  );
}

export default App;
