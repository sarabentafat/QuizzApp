import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

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

        setWinners(usersArray);
      }
    };

    // Set up a listener to update winners whenever the data changes
    const unsubscribe = onValue(usersRef, updateWinners);

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Winners</h1>
      <ul>
        {winners.map((winner) => (
          <li key={winner.userId}>
            <p>Name: {winner.name}</p>
            <p>Email: {winner.email}</p>
            <p>Correct Answers: {winner.correctAnswers}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Winners;
