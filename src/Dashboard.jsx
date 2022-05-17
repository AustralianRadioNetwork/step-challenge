import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

import "./Dashboard.scss";

import { auth, db, logout } from "./Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [steps, setStep] = useState("");
  const [region, setRegion] = useState("");
  const [group, setGroup] = useState("");

  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.firstName);
      setStep(data.totalSteps);
      setRegion(data.region);
      setGroup(data.group);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  const updateSteps = () => {
    navigate("/update");
  };

  const edit = () => {
    navigate(`edit-profile`);
  };

  return (
    <div className='dashboard'>
      <div className='dashboard_container'>
        <div className='user_info'>
          <div className='welcome'>
            <h2>Welcome back {name}!</h2>
            <p>
              You’re currently logged in with the email {user.email}.
              <div className='link' onClick={logout}>
                Logout
              </div>
            </p>
            <p>
              Welcome to the My Account page of the Feb Fit Step Challenge
              website. Here you can log your steps, update your details or log
              out of your account.
            </p>

            <a onClick={logout}>
              <img /> Log out
            </a>
            <br />
            <a href='/edit'>
              <img /> Edit Profile
            </a>
          </div>
          <div className='membership'>
            <h2>Memberships</h2>
            <p>
              See stats and leaderboards for your region and group selected when
              joining the challenge. If you didn’t select a group, you can do
              this from the <a href='/edit'>Edit Profile</a> page at anytime.
            </p>
            <p>
              Please note you can’t change your region or group during the
              challenge.
            </p>
            <p>
              Your Region: <Link to={`/region/${region}`}>{region}</Link>
            </p>
            <p>
              Your Group: <a href='/'>{group}</a>
            </p>
          </div>
        </div>
        <div className='current_status'>
          <div className='card'>
            <div className='title'>
              <h2>Your Steps</h2>
            </div>
            <div className='stats'>
              <h4>Current Steps: {steps}</h4>
              <button
                className='dashboard_btn update_btn'
                onClick={updateSteps}
              >
                Update Steps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
