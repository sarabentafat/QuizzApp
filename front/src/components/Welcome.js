import React, { useContext, useState, useEffect } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../config/firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

import part2 from "../parts/part2.svg";
import part3 from "../parts/part3.svg";
export const Welcome = () => {
  const { setGameState } = useContext(GameStateContext);
  const [pocketCard, setPocketCard] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [userImage, setUserImage] = useState("");

  const handleShowImage = () => {
    setShowImage(!showImage);
  };

  const startGame = () => {
    setGameState("playing");
  };

  const fetchPocketCard = async (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    try {
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userPocketCard = userData.pocketCard;

        // Fetch the image URL from Firebase Storage
        const storage = getStorage();
        const pocketCardRef = storageRef(storage, userPocketCard);
        const imageURL = await getDownloadURL(pocketCardRef);

        return imageURL;
      } else {
        console.error("User data not found in the Realtime Database.");
        // Return a default or placeholder image URL here if needed
        return ""; // Updated to return an empty string
      }
    } catch (error) {
      console.error("Error fetching user data and pocket card:", error);
      return ""; // Return an empty string in case of an error
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserImage(user.photoURL || "");

      fetchPocketCard(user.uid)
        .then((imageURL) => {
          setPocketCard(imageURL);
          console.log(imageURL);
        })
        .catch((error) => {
          console.error("Error fetching user's pocket card:", error);
        });
    }
  }, []);

  return (
    <>
      <div className="flex justify-between mt-5  items-center">
        <div className="p-2">
          <button
            className=" mt-5 ml-8 bg-white text-black h-fit py-2 px-3 text-xl font-bold rounded-3xl   mb-3"
            onClick={handleShowImage}
          >
            <p className="p-1">My card</p>
          </button>
        </div>
        {showImage && (
          // <img style={{ width: "150px" }} src={pocketCard} alt="Pocket Card" />
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
            <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
              <div
                className={`translate duration-300 h-full  translate-y-0 opacity-100 backdrop-blur`}
              >
                <div
                  className="
                  translate  lg:h-auto md:h-auto border-0 rounded-3xl  shadow-lg relative flex flex-col  outline-none focus:outline-none
                  "
                >
                  <div className=" p-6 rounded-t justify-center relative">
                    <button
                      className="mt-5 ml-8 bg-white text-black h-fit py-2 px-3 text-xl font-bold rounded-xl  mb-3"
                      onClick={handleShowImage}
                    >
                      My card
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <img src={pocketCard} alt="" srcset="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-[100%] flex items-start gap-3">
        <img src={part2} alt="" srcset="" />
        <div className="text-white w-[70%] text-start mt-10 flex flex-col gap-5">
          <h2 className="text-5xl font-bold">Welcome </h2>
          <div className="flex flex-col gap-1">
            <p
              style={{ color: "#BABABA" }}
              className="text-xl px-3 text-justify"
            >
              <span className="font-bold">Tech Quiz Challenge </span>is an
              interactive trivia game that tests your knowledge of technology.
              With questions ranging from basic concepts to advanced topics,
              it's a fun way to explore the digital world and challenge yourself
              or friends. How well do you know tech? Find out now!
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0">
        <img src={part3} alt="" srcset="" className="left-0" />
      </div>
      <button
        style={{ backgroundColor: "red" }}
        className=" text-white bg-gradient-to-r from-red-600  to-red-400    right-[10%] absolute bottom-[10%] rounded-3xl  text-xl py-3 px-16 uppercase"
        onClick={startGame}
      >
        play
      </button>
    </>
  );
};
