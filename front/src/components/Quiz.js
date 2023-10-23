import React, { useContext, useState, useEffect } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, get } from "firebase/database";
import { auth,db } from "../config/firebase";
import { updateDoc, increment, serverTimestamp, doc } from "firebase/firestore";
import {Questions} from "../helpers/Questions"
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

function Quiz() {
  const [pocketCard, setPocketCard] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [userImage, setUserImage] = useState("");

  const handleShowImage = () => {
    setShowImage(!showImage);
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

    }
          fetchPocketCard(user.uid)
            .then((imageURL) => {
              setPocketCard(imageURL);
              console.log(imageURL);
            
            })
            .catch((error) => {
              console.error("Error fetching user's pocket card:", error);
            });
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
    <div className="h-full">
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
      <div>
        <div className="h-[30%] flex justify-center bg-part4 bg-no-repeat bg-contain mx-auto relative">
          {/* <h2>Your Pocket Card:</h2>
        <button onClick={handleShowImage}>Show Image</button>
        {showImage && (
          <img className="w-[15px]" src={pocketCard} alt="Pocket Card" />
        )} */}
          <p className=" font-bold w-[80%] mt-[10%] mb-5">
            {Questions[currentQuestion].prompt}
          </p>
        </div>

        <div className="questions bg-white flex flex-col absolute w-full bottom-0  h-[60%] rounded-tr-[60px] rounded-tl-[60px] border-white">
          <h2 className="text-gray-400 text-sm text-center my-10 font-bold">
            Select the correct answer
          </h2>
          <div className="text-black flex flex-col gap-6 items-center mb-6">
            <button
              onClick={() => chooseOption("optionA")}
              className="cursor-auto rounded-2xl    text-xl py-2 w-[80%] font-bold border-none"
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionA}
            </button>

            <button
              onClick={() => chooseOption("optionB")}
              className="cursor-auto rounded-2xltext-xl py-2 w-[80%] font-bold border-none"
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionB}
            </button>

            <button
              onClick={() => chooseOption("optionC")}
              className="cursor-auto rounded-2xl   text-xl py-2 w-[80%] font-bold border-none"
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionC}
            </button>

            <button
              onClick={() => chooseOption("optionD")}
              className="cursor-auto rounded-2xl   text-xl py-2 w-[80%] font-bold border-none"
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionD}
            </button>
          </div>
          <div className="w-[100%] flex justify-center">
            {currentQuestion === Questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                id="nextQuestion"
                disabled={!isOptionChosen || loading}
                className={`py-3 px-10 rounded-2xl cursor-pointer text-2xl font-bold ${
                  isOptionChosen
                    ? "bg-red-500  text-white"
                    : " bg-black text-white"
                }`}
              >
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                id="nextQuestion"
                disabled={!isOptionChosen || loading}
                className={`py-3 px-10 rounded-2xl cursor-pointer text-2xl font-bold ${
                  isOptionChosen
                    ? "bg-red-500  text-white"
                    : " bg-black text-white"
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
