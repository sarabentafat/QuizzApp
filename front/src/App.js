import "./App.css";
import Menu from "./components/Menu";
import Quiz from "./components/Quiz";
import EndScreen from "./components/EndScreen";
import { useState } from "react";
import { GameStateContext } from "./helpers/Contexts";
import { Auth } from "./components/Auth";
import { Welcome } from "./components/Welcome";
import Winners from "./components/Winners";
import { Browser } from "./components/Browser";
import {
  BrowserView,
  MobileView,
} from "react-device-detect";
function App() {
  const [gameState, setGameState] = useState("menu");
  const [userName, setUserName] = useState("");
  const [score, setScore] = useState(0);

  return (
    <>
      <MobileView>
        <div className="flex text-white justify-center w-[100%]">
          <div className="App w-[100%] max-w-[600px] relative bg-black flex flex-col h-[100vh]">
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
              {gameState === "welcome" && <Welcome />}
              {gameState === "auth" && <Auth />}
              {gameState === "playing" && <Quiz />}
              {gameState === "finished" && <EndScreen />}
              {gameState === "winners" && <Winners />}
            </GameStateContext.Provider>
      
          </div>
        </div>
      </MobileView>
      <BrowserView>
        <Browser/>
      </BrowserView>
    </>
  );
}

export default App;
