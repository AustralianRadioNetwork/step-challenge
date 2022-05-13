import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

// firebase services
import { auth, db, logout } from "./Firebase";
import {
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  doc,
  push,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { update, ref, set, getDatabase } from "firebase/database";

const UpdateSteps = () => {
  const [user, loading, error] = useAuthState(auth);

  const [steps, setStep] = useState("");

  const [logSteps, setLogStep] = useState("");

  const navigate = useNavigate();

  const fetchSteps = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setStep(data.totalSteps);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchSteps();
  }, [user, loading]);

  const currentDate =
    new Date().getFullYear() +
    "-" +
    ("0" + (new Date().getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + new Date().getDate()).slice(-2);

  const mapData =
    new Date().toLocaleString("en-au", { month: "short" }) +
    +("0" + new Date().getDate()).slice(-2);

  const updateSteps = async (newSteps) => {
    // updateData base
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const res = await getDocs(q);
      const data = res.docs[0].data();

      let newDataSet = [];
      console.log(data.breakdown);

      if (data.breakdown.length !== 0) {
        data.breakdown.forEach((entry) => {
          if (entry.date === currentDate) {
            // remove data once pushed
            res.forEach(async (user) => {
              const getUser = doc(db, "users", user.id);
              await updateDoc(getUser, {
                breakdown: arrayRemove(entry),
              });
            });
          } else {
            //pushing all the old entries first
          newDataSet.push(entry);

          // remove data once pushed
          res.forEach(async (user) => {
            const getUser = doc(db, "users", user.id);
            await updateDoc(getUser, {
              breakdown: arrayRemove(entry),
            });
          });
          }
        });

        const updatedSteps = parseInt(newSteps);

        newDataSet.push({ date: currentDate, steps: updatedSteps });

        setStep(updatedSteps);
      }

      newDataSet.forEach((entry) => {
        res.forEach(async (user) => {
          const getUser = doc(db, "users", user.id);
          await updateDoc(getUser, {
            breakdown: arrayUnion(entry),
          });
        });
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  return (
    <div className='update-steps-container'>
      <p>
        Current Steps as of {currentDate} is <strong>{steps}</strong>
      </p>
      <input
        type='text'
        className='update_textBox'
        value={logSteps}
        onChange={(e) => setLogStep(e.target.value)}
        placeholder='log setps'
      />
      <button className='update_btn' onClick={() => updateSteps(logSteps)}>
        Update
      </button>
    </div>
  );
};
export default UpdateSteps;
