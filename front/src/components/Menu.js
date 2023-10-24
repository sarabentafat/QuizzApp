import "../App.css";
import { useContext } from "react";
import { GameStateContext } from "../helpers/Contexts";
import carta from "../images/carta.svg";
import bg from "../images/bg.svg"
function Menu() {
  const { setGameState} = useContext(
    GameStateContext
  );
  return (
    <div className=" w-full h-screen">
      <div className="h-[60%]">
        <div className="relative">
          <div>
            <img
              src={carta}
              className="z-30 absolute w-[1000px] top-10 "
              alt="Carts"
            />
          </div>
          <img src={bg} className="absolute z-0   " alt="Background" />
        </div>
      </div>
      <div className=" flex flex-col justify-end items-center mt-[-60px]">
        <h1 className="text-center text-6xl text-white font-bold w-[100%]">
          SOAI’S
        </h1>
        <h1 className="text-center text-6xl text-white font-bold w-[100%]">
          GAME
        </h1>
        <p className="text-center text-red-500 mt-10">you want to play ?</p>
        <div className="w-full flex">
          <button
            onClick={() => {
              setGameState("auth");
            }}
            className="bg-gradient-to-r from-red-600  to-red-400 w
            bg-red-500 text-white py-3 px-6  mx-auto mt-3 rounded-3xl w-[70%]"
          >
            Register now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
