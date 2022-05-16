import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Accordion from "./Component/Accordion";

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

  const [steps, setStep] = useState([]);

  const [loggedSteps, setLoggedStep] = useState([]);

  const navigate = useNavigate();

  // steps for each day of feb
  const stepsArray = [];

  // fetch the current date steps
  const fetchSteps = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      data.breakdown.forEach((day) => {
        stepsArray.push(day);
      });

      setStep(stepsArray);
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

  const getData = (val) => {

    console.log(val)

    let newStepsArray = [];
    
    steps.forEach((entry) => {
      if (val.date === entry.date) {
        newStepsArray.push({ date: val.date, steps: val.steps });
      } else {
        // push remaning data
        newStepsArray.push(entry);
      }
    });

    setLoggedStep(newStepsArray)
  };

  const handleChange = (event) => {
    let date = event.target.name;
    setLoggedStep(event.target.value);

    let newStepsArray = [];

    steps.forEach((entry) => {
      if (date === entry.date) {
        newStepsArray.push({ date: date, steps: loggedSteps });
      }
      // push remaning data
      newStepsArray.push(entry);
    });

    setStep(newStepsArray);
    console.log(steps);
  };

  const updateSteps = async (newSteps) => {

    console.log(newSteps)

    // update Database
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const res = await getDocs(q);
      const data = res.docs[0].data();

      let newDataSet = newSteps;

      let totalStepsTillDate = 0;
      
      data.breakdown.forEach((entry) => {
        res.forEach(async (user) => {
          const getUser = doc(db, "users", user.id);
          await updateDoc(getUser, {
            breakdown: arrayRemove(entry),
          });
        });
      });

      newDataSet.forEach((entry) => {
        res.forEach(async (user) => {
          const getUser = doc(db, "users", user.id);
          await updateDoc(getUser, {
            breakdown: arrayUnion(entry),
          });
        });

        totalStepsTillDate += entry.steps;
      });

      //setting total steps
      res.forEach(async (user) => {
        const getUser = doc(db, "users", user.id);
        await updateDoc(getUser, {
          totalSteps: totalStepsTillDate,
        });
      });

      // once updated navigate back to home page
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  return (
    <div className='update-steps-container'>
      <ul>
        {steps.map((item) => {
          return (
            <Accordion
              key={item.date}
              date={item.date}
              steps={item.steps}
              sendData={getData}
            />
          );
        })}
      </ul>
      <div>
        <button className='update_btn' onClick={() => updateSteps(loggedSteps)}>
          submit
        </button>
      </div>
    </div>
  );
};
export default UpdateSteps;
