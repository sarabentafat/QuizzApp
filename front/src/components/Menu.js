import "../App.css";
import { useContext } from "react";
import { GameStateContext } from "../helpers/Contexts";

function Menu() {
  const { gameState, setGameState, userName, setUserName } = useContext(
    GameStateContext
  );
  return (
    <div className="Menu">
      <label>SOAI's GAME</label>
      <p className="text-red-500">u want to play? </p>
      <button onClick={()=>{
        setGameState("auth")
      }}>Register now</button>
      
    </div>
  );
}

export default Menu;
