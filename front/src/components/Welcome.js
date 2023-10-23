import React, { useContext, useState, useEffect } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../config/firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
// import { Model } from "./Model";
import part1 from "../parts/part1.svg";
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
          console.log(imageURL)
        })
        .catch((error) => {
          console.error("Error fetching user's pocket card:", error);
        });
    }
  }, []);

  return (
    <>

      <div className="flex justify-between mt-20 items-center">
        <button
          className="bg-white text-black h-fit py-2 px-3 text-xl font-bold rounded-xl ml-4"
          onClick={handleShowImage}
        >
          My card
        </button>
        {showImage && (
          <img style={{ width: "150px" }} src={pocketCard} alt="Pocket Card" />
        )}
      </div>
      <div className="w-[100%] flex items-start gap-3">
        <img src={part2} alt="" srcset="" />
        <div className="text-white w-[70%] text-start mt-2 flex flex-col gap-5">
          <h2 className="text-5xl font-bold">Welcome </h2>
          <div className="flex flex-col gap-1">
            <h4 className="text-2xl">How to play</h4>
            <p style={{ color: "#BABABA" }} className="text-xl px-3">
              Worem ipsum dolor sit amet, consectetur adipiscing elit Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Soluta eaque
              vero dolorem ex, rem ullam doloribus nihil .
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0">
        <img src={part3} alt="" srcset="" className="left-0" />
      </div>
      <button
        style={{ backgroundColor: "red" }}
        className=" text-white right-[10%] absolute bottom-[10%] rounded-3xl text-xl py-3 px-16 uppercase"
        onClick={startGame}
      >
        play
      </button>

    </>
  );
};
