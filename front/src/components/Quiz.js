import React, { useContext, useState, useEffect } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, get } from "firebase/database";
import { auth,db } from "../config/firebase";
import { updateDoc, increment, serverTimestamp, doc } from "firebase/firestore";
import {Questions} from "../helpers/Questions"
function fetchPocketCardFromRealtimeDB(userId) {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);

  return get(userRef)
    .then((userSnapshot) => {
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userPocketCard = userData.pocketCard;
        return userPocketCard;
      } else {
        console.error("User data not found in the Realtime Database.");
        return null;
      }
    })
    .catch((error) => {
      console.error(
        "Error fetching user data from the Realtime Database: ",
        error
      );
      return null;
    });
}

function Quiz() {
  const [pocketCard, setPocketCard] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [userImage, setUserImage] = useState("");

  const handleShowImage = () => {
    setShowImage(!showImage);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserImage(user.photoURL || "");

      fetchPocketCardFromRealtimeDB(user.uid)
        .then((pocketCard) => {
          setPocketCard(pocketCard);
        })
        .catch((error) => {
          console.error("Error fetching user's pocketCard:", error);
        });
    }
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [optionChosen, setOptionChosen] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const { score, setScore, gameState, setGameState } =
    useContext(GameStateContext);

  const chooseOption = (option) => {
    setOptionChosen(option);
  };

const nextQuestion = () => {
  if (Questions[currentQuestion].answer === optionChosen) {
    setScore(score + 1);
  }
  setCurrentQuestion(currentQuestion + 1);
  setOptionChosen(""); // Clear the selected option for the next question
};

  const finishQuiz = async () => {
    if (Questions[currentQuestion].answer === optionChosen) {
      const newScore = score + 1;
console.log(currentQuestion)
console.log(newScore)
 setScore(newScore);
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = ref(db, "users", userId);

        try {
          setLoading(true);
          await updateDoc(userDocRef, {
            correctAnswers: increment(1),
            lastQuizCompletedAt: serverTimestamp(),
          });
          console.log("Correct Answers updated in Firestore");
         
        } catch (error) {
          console.error("Error updating Correct Answers in Firestore: ", error);
        } finally {
          setLoading(false);
        }
      }
    }

    setGameState("finished");
  };

  const isOptionChosen = optionChosen !== "";

  return (
    <div className="Quiz">
      <div>
        <h2>Your Pocket Card:</h2>
        <button onClick={handleShowImage}>Show Image</button>
        {showImage && (
          <img className="w-[15px]" src={pocketCard} alt="Pocket Card" />
        )}
      </div>
      <h1>{Questions[currentQuestion].prompt}</h1>
      <div className="questions">
        <div>
          <button onClick={() => chooseOption("optionA")}>
            {Questions[currentQuestion].optionA}
          </button>
        </div>
        <div>
          <button onClick={() => chooseOption("optionB")}>
            {Questions[currentQuestion].optionB}
          </button>
        </div>
        <div>
          <button onClick={() => chooseOption("optionC")}>
            {Questions[currentQuestion].optionC}
          </button>
        </div>
        <div>
          <button onClick={() => chooseOption("optionD")}>
            {Questions[currentQuestion].optionD}
          </button>
        </div>
      </div>

      {currentQuestion === Questions.length - 1 ? (
        <button
          onClick={finishQuiz}
          id="nextQuestion"
          disabled={!isOptionChosen || loading}
        >
          Finish Quiz
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          id="nextQuestion"
          disabled={!isOptionChosen || loading}
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default Quiz;
