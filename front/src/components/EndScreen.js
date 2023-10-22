import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { serverTimestamp } from "firebase/database";
import { useContext } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { Questions } from "../helpers/Questions";
import { auth } from "../config/firebase";

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
    }, 3000);

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
    <div className="EndScreen">
      <h1>Quiz Finished</h1>
      {userImage && <img src={userImage} alt="User" />}
      <h3>THANK YOU {userName} FOR PARTICIPATING</h3>
      <p>Wait a few seconds to know the winners</p>
      <h1>
        Score: {score} / {Questions.length}
      </h1>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};

export default EndScreen;
