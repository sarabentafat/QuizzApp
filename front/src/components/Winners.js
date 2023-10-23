import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import crown from "../images/crown.svg"
import resultCard from "../images/resultsCard.svg";
import Heart from "../images/Heart.svg"
import carts from '../images/carts.svg'
import trafel1 from "../images/trefle1.svg"
import trafel2 from "../images/trafel2.svg"
import trafel3 from "../images/trafel3.svg";
const Winners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    // Create a function to update the winners whenever data changes
    const updateWinners = (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Convert user data into an array
        const usersArray = Object.values(userData);

        // Sort the users by correctAnswers and timestamp
        usersArray.sort((a, b) => {
          if (a.correctAnswers > b.correctAnswers) {
            return -1; // Sort in descending order of correct answers
          } else if (a.correctAnswers < b.correctAnswers) {
            return 1;
          } else {
            // If correctAnswers are the same, sort by timestamp
            return a.timestamp - b.timestamp;
          }
        });

        // Get the first 4 winners
        const firstFourWinners = usersArray.slice(0, 4);

        setWinners(firstFourWinners);
      }
    };

    // Set up a listener to update winners whenever the data changes
    const unsubscribe = onValue(usersRef, updateWinners);

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
    const images = [Heart, trafel1, trafel2, trafel3]; 

  return (
    <>
      <div className="justify-center  flex mx-10 mt-20">
        <h1 className="text-white font-serif font-bold text-5xl text-center capitalize mb-3">
          congrats
        </h1>
        <img className="absolute top-0 right-1" src={crown} alt="" />
      </div>
      <img src={carts} className="mt-5" />
      <div className="flex flex-col justify-center absolute w-full bottom-0 bg-white h-[62%] rounded-tr-[60px] rounded-tl-[60px] border-white">
        <h2 className="text-gray-500 text-base mb-5 text-center font-thin">
          the four winners are
        </h2>
        <div className="flex h-[80%]  text-black flex-col gap-4 items-center mb-6">
          {winners.map((winner, index) => (
            <div key={winner.userId} className="w-[80%] ">
              <div
                className="flex cursor-auto rounded-2xl  text-xl p-3 font-bold border-none"
                style={{
                  boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
                }}
              >
                <img
                  src={images[index]} // Use the image based on the index
                  alt={winner.name}
               className="w-8 ml-1"
                />
                <p className="ml-2">{winner.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Winners;
