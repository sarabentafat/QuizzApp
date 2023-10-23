import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "../helpers/Contexts";
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage, ref as storageRef, listAll } from "firebase/storage";
import login from "../images/loginright.svg";
import GoogleIcon from "../parts/googleicon.svg";
export const Auth = () => {
  const { setGameState } = useContext(GameStateContext);
  const [maleUsers, setMaleUsers] = useState(0);
  const [femaleUsers, setFemaleUsers] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [isGenderSelected, setIsGenderSelected] = useState(false);
  const [userCounter, setUserCounter] = useState(0);
  const [transitionTimeout, setTransitionTimeout] = useState(null);
  const findImageIndex = (imageRefs, pattern) => {
    for (let i = 0; i < imageRefs.length; i++) {
      if (imageRefs[i].fullPath.includes(pattern)) {
        return i;
      }
    }
    return -1;
  };

  const findImageIndexes = (imageRefs, patterns) => {
    const indexes = [];

    for (let i = 0; i < imageRefs.length; i++) {
      const item = imageRefs[i].fullPath;
      let shouldInclude = true;
      for (let j = 0; j < patterns.length; j++) {
        if (item.includes(patterns[j])) {
          shouldInclude = false;
          break;
        }
      }
      if (shouldInclude) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  const signInWithGoogle = async () => {
    const getRandomIndex = function (arr) {
      if (arr.length === 0) {
        return -1;
      }
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    };

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(`User signed in: ${user.displayName}`);
      const storage = getStorage();
      const imagesRef = storageRef(storage, "pockets_images");

      const imageRefs = await listAll(imagesRef);

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists() && snapshot.val().played) {
        setGameState("finished");
      } else {
        if (imageRefs.items.length > 0) {
          let selectedImageRef;

          if (selectedGender === "Male" && maleUsers < 4) {
            const pattern = `K${maleUsers + 1}.png`;
            const imageIndex = findImageIndex(imageRefs.items, pattern);
            selectedImageRef = imageRefs.items[imageIndex];
          } else if (selectedGender === "Female" && userCounter < 4) {
            const pattern = `Q${femaleUsers + 1}.png`;
            const imageIndex = findImageIndex(imageRefs.items, pattern);
            selectedImageRef = imageRefs.items[imageIndex];
          } else {
            const patterns = ["Q", "K"];
            const result = findImageIndexes(imageRefs.items, patterns);
            const imageIndex = getRandomIndex(result);
            selectedImageRef = imageRefs.items[imageIndex];
          }

          const userData = {
            name: user.displayName,
            email: user.email,
            gender: selectedGender,
            userId: user.uid,
            correctAnswers: 0,
            pocketCard: selectedImageRef.fullPath,
            played: false,
          };

          await set(userRef, userData);
          console.log("User data stored in the database");

          setUserCounter(userCounter + 1);
          countMaleUsers();
          countFemaleUsers();
          setGameState("welcome");
        } else {
          console.error("No images found in Firebase Storage.");
        }
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
    setIsGenderSelected(true);
  };

  const enableSignIn = isGenderSelected && selectedGender !== "";

  const countMaleUsers = async () => {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    let maleUserCount = 0;

    if (snapshot.exists()) {
      const userData = snapshot.val();

      for (const userId in userData) {
        if (userData[userId].gender === "Male") {
          maleUserCount++;
        }
      }

      setMaleUsers(maleUserCount);
    }
  };

  const countFemaleUsers = async () => {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    let femaleUserCount = 0;

    if (snapshot.exists()) {
      const userData = snapshot.val();

      for (const userId in userData) {
        if (userData[userId].gender === "Female") {
          femaleUserCount++;
        }
      }

      setFemaleUsers(femaleUserCount);
    }
  };

  useEffect(() => {
    setUserCounter(0);
    countMaleUsers();
    countFemaleUsers();
        return () => {
          if (transitionTimeout) {
            clearTimeout(transitionTimeout);
          }
        };
  }, [selectedGender,transitionTimeout]);

  return (
    // <div>
    //   <div>
    //     <h1>Google Authentication</h1>
    //     <button
    //       className="bg-white text-green-700 font-bold p-1"
    //       onClick={signInWithGoogle}
    //       disabled={!enableSignIn}
    //     >
    //       Sign in with Google
    //     </button>
    //   </div>
    //   <div>
    //     <h3>Select Gender:</h3>
    //     <div>
    //       <input
    //         type="radio"
    //         id="male"
    //         name="gender"
    //         value="Male"
    //         checked={selectedGender === "Male"}
    //         onChange={handleGenderChange}
    //       />
    //       <label htmlFor="male">Male</label>
    //     </div>
    //     <div>
    //       <input
    //         type="radio"
    //         id="female"
    //         name="gender"
    //         value="Female"
    //         checked={selectedGender === "Female"}
    //         onChange={handleGenderChange}
    //       />
    //       <label htmlFor="female">Female</label>
    //     </div>
    //     <p>Selected Gender: {selectedGender}</p>
    //   </div>
    //   <p>Male Users: {maleUsers}</p>
    //   <p>Female Users: {femaleUsers}</p>
    // </div>
    <div className={`bg-login bg-cover  bg-no-repeat w-[100%] h-[100%]`}>
      <div className="flex justify-center items-center- w-[100%] ">
        <img src={login} alt="" className="w-[200px] mt-[35%]" />
      </div>
      <div>
        <button
          onClick={signInWithGoogle}
          disabled={!enableSignIn}
          className="flex w-[70%] rounded-2xl bg-white px-7 text-black py-3 gap-3 mx-auto  mt-6"
        >
          <img src={GoogleIcon} alt="googleIcon" />
          <span className="font-thin"></span>Log with google
        </button>
      </div>
      <div className="flex flex-col text-white text-xl ml-[20%] mt-10 mb-4">
        <h3 className="text-white font-bold">Select Gender:</h3>
        <div className="flex gap-3">
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            checked={selectedGender === "Male"}
            onChange={handleGenderChange}
          />
          <label htmlFor="male">Male</label>
        </div>
        <div className="flex gap-3">
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            checked={selectedGender === "Female"}
            onChange={handleGenderChange}
          />
          <label htmlFor="female">Female</label>
        </div>
      </div>
    </div>
  );
};
