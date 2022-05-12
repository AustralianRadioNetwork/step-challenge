import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

// firebase services
import { auth, db, logout } from "./Firebase";
import { query, collection, getDocs, where, updateDoc, doc } from "firebase/firestore";
import { update, ref, set, getDatabase } from "firebase/database";

const UpdateSteps = () => {
  const [user, loading, error] = useAuthState(auth);

  const [steps, setStep] = useState("");

  const [logSteps, setLogStep] = useState("");

  const navigate = useNavigate();

  const dbRef = ref(getDatabase());

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
    new Date().getDay() +
    "-" +
    new Date().toLocaleString("en-au", { month: "long" }) +
    "," +
    new Date().getFullYear();

  const updateSteps = async (newSteps) => {
    // updateData base
    try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const res = await getDocs(q);
        const data = res.docs[0].data();
        const updatedSteps = parseInt(data.totalSteps) + parseInt(newSteps);


        res.forEach( async (user) => {
            const getUser = doc(db, 'users', user.id);
            await updateDoc(getUser, {
             totalSteps: updatedSteps
            });
        });
    

      setStep(updatedSteps);
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
