import React, { useContext, useState, useEffect, useRef } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, get } from "firebase/database";
import { auth, db } from "../config/firebase";
import { updateDoc, increment, serverTimestamp, doc } from "firebase/firestore";
import { Questions } from "../helpers/Questions";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import Quizz from "../images/Quizz.svg"
function Quiz() {
  const [pocketCard, setPocketCard] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [progressLoaded, setProgressLoaded] = useState(0);
  const [second, setSecond] = useState(0);
  const intervalRef = useRef();
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
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setSecond(0);
  };
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecond((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [second]);
  useEffect(() => {
    setProgressLoaded((second / 15) * 100);
    if (second === 15) {
      clearInterval(intervalRef.current);
      setTimeout(() => {
        handleTimeUp();
      }, 1000);
    }
  }, [second]);
  const handleTimeUp = () => {
    if (currentQuestion === Questions.length - 1) {
      finishQuiz();
    } else {
      nextQuestion();
      resetTimer();
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
    resetTimer();
    setCurrentQuestion(currentQuestion + 1);
    setOptionChosen(""); // Clear the selected option for the next question
  };

  const finishQuiz = async () => {
    if (Questions[currentQuestion].answer === optionChosen) {
      const newScore = score + 1;
      console.log(currentQuestion);
      console.log(newScore);
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
      <div className="flex justify-center w-full">
        <div className="w-[90%] h-2 border-none flex justify-center mt-10">
          <div
            className={`h-2 duration-1000 w-0 bg-red-700 ease-linear rounded-full`}
            style={{ width: `${progressLoaded}%` }}
          ></div>
        </div>
      </div>
      <div className="h-[30%] flex justify-center mt-20 mx-auto relative">
        <img
          src={Quizz}
          className="absolute top-[-58px] z-0 w-[90%] h-[250px] "
        />
        <p className="p-2 z-30 text-black font-bold w-[77%]  py-5">
          {Questions[currentQuestion].prompt}
        </p>
      </div>
      <div>
        nnn
        <div className="h-[30%] flex  flex-col justify-center bg-part4 bg-no-repeat bg-contain mx-auto relative">
          <p className=" font-bold w-[80%] mt-[10%] mb-5">
            {Questions[currentQuestion].prompt}
          </p>
        </div>
        <div className="questions bg-white flex flex-col absolute w-full bottom-0  h-[60%] rounded-tr-[60px] rounded-tl-[60px] border-white">
          <div>
            <h2 className="text-gray-400 text-sm text-center mt-5 mb-10  font-bold">
              Select the correct answer
            </h2>
          </div>
          <div className="text-black  flex flex-col gap-6 items-center mb-6">
            <button
              onClick={() => chooseOption("optionA")}
              className="cursor-auto rounded-2xl    text-xl py-2 w-[80%] font-bold border-none hover:border-2 hover:border-black hover:border-solid"
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionA}
            </button>

            <button
              onClick={() => chooseOption("optionB")}
              className="cursor-auto rounded-2xl text-xl py-2 w-[80%] font-bold border-none hover:border-2 hover:border-black hover:border-solid "
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionB}
            </button>

            <button
              onClick={() => chooseOption("optionC")}
              className="cursor-auto rounded-2xl   text-xl py-2 w-[80%] font-bold border-none hover:border-2 hover:border-black hover:border-solid"
              style={{
                boxShadow: "3.26923px 4.35897px 9px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              {Questions[currentQuestion].optionC}
            </button>

            <button
              onClick={() => chooseOption("optionD")}
              className="cursor-auto rounded-2xl   text-xl py-2 w-[80%] font-bold border-none hover:border-2 hover:border-black hover:border-solid"
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
