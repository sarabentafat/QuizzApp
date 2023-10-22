import React, { useContext, useState, useEffect } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "../config/firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

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
    <div>
      Welcome
      <div>
        <h2>Your Pocket Card:</h2>
        <button onClick={handleShowImage}>Show Image</button>
        {showImage && (
          <img style={{ width: "150px" }} src={pocketCard} alt="Pocket Card" />
        )}
      </div>
      <div>
        <h1>How to play?</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu
        </p>
      </div>
      <button onClick={startGame}>Play</button>
    </div>
  );
};
