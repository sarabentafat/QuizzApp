import "../App.css";
import { useContext } from "react";
import { GameStateContext } from "../helpers/Contexts";

function Menu() {
  const { gameState, setGameState, userName, setUserName } = useContext(
    GameStateContext
  );
  return (
    <div className="Menu bg-cards w-full h-[87%] bg-no-repeat bg-cover bg-top">
      <div className=" flex flex-col justify-end items-center h-[100%]">
        <h1 className="text-center text-6xl text-white font-bold w-[100%]">
          SOAI’S
        </h1>
        <h1 className="text-center text-6xl text-white font-bold w-[100%]">
          GAME
        </h1>
        <p className="text-center text-red-800 mt-10">you want to play ?</p>
        <div className="w-[100%] flex">
          <button
            onClick={() => {
              setGameState("auth");
            }}
            className="bg-red-800 text-white py-3 px-6 w-fit mx-auto mt-6 rounded-xl"
          >
            Register now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
