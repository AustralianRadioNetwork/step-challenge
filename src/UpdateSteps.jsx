import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Accordion from "./Component/Accordion";

// Styles
import './UpdateSteps.scss';

// firebase services
import { auth, db } from "./Firebase";
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

const UpdateSteps = () => {
  
  const [user, loading, error] = useAuthState(auth);

  const [steps, setStep] = useState([]);

  const [loggedSteps, setLoggedStep] = useState([]);

  // const navigate = useNavigate();

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
    if (!user) return window.location.href = "/";
    fetchSteps();
  }, [user, loading, loggedSteps]);

  const getData = (val) => {
    console.log(val);

    let newStepsArray = [];

    steps.forEach((entry) => {
      if (val.date === entry.date) {
        newStepsArray.push({ date: val.date, steps: val.steps });
      } else {
        // push remaning data
        newStepsArray.push(entry);
      }
    });

    setLoggedStep(newStepsArray);
  };

  const updateSteps = async (newSteps) => {
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
        }).then(() => {
          // // once updated navigate back to home page
          window.location.href = "/dashboard";
        });
      });

  
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  return (
    <div className='update-steps-container'>
      <ul className="list">
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
      <div className="button-container">
        {loggedSteps.length !== 0 ? (
          <button
            className='update_btn'
            onClick={() => updateSteps(loggedSteps)}
          >
            submit
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default UpdateSteps;
