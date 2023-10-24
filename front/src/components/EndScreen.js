import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { serverTimestamp } from "firebase/database";
import { useContext } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { auth } from "../config/firebase";
import Carts from "../images/thanksCarte.svg"
import thanku from "../images/thanku.svg"
const EndScreen = () => {
  const { score, setScore, setGameState } = useContext(GameStateContext);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const updateCorrectAnswers = async (userId, newScore) => {
    const db = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);

      try {
        await update(userRef, {
          correctAnswers: newScore,
          lastQuizCompletedAt: serverTimestamp(),
          played:true
        });
        console.log("Correct Answers updated in the Realtime Database");
      } catch (error) {
        console.error(
          "Error updating Correct Answers in the Realtime Database: ",
          error
        );
      }
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "Guest");
      setUserImage(user.photoURL || "");
    }
    updateCorrectAnswers(user.uid, score); // Use user.uid to access the user's unique ID

    // Delay the transition to the "Winners" state after 3000 milliseconds (3 seconds)
    const transitionTimeout = setTimeout(() => {
      setGameState("winners");
    }, 10000);

    // Clear the timeout when the component unmounts to prevent memory leaks
    return () => {
      clearTimeout(transitionTimeout);
    };
  }, [score, setGameState]);

  const restartQuiz = () => {
    setScore(0);
    setGameState("menu");
  };

  return (

      <>
        <div className="EndScreen flex h-[50%] items-center">
          <img src={Carts} alt="thank u cart" className="m-auto" />
        </div>
        {/* {userImage && <img src={userImage} alt="User" />} */}
        <div className="text-white text-3xl font-bold text-center">
          <h1>THANK YOU</h1>
          <h1>FOR</h1>
          <h1>PARTICIPATING</h1>
        </div>
        <div className="text-gray-500 text-sm text-center mt-6">
          <p>wait a few seconds to know the winners</p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <img className="text-center" src={thanku} />
        </div>

        {/* <h1>
        Score: {score} / {Questions.length}
      </h1>
      <button onClick={restartQuiz}>Restart Quiz</button> */}
      </>
 
  );
};

export default EndScreen;
