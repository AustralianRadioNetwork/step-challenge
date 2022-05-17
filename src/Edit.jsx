import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, sendPasswordReset } from "./Firebase";
import {
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

// Styles
import "./Edit.scss";

const Edit = () => {
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [newGroup, setNewGroup] = useState("");

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setGroup(data.group);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const onChangeGroup = (event) => {
    setGroup(event.target.value);
  };

  const resetPassowrd = () => {
    navigate('/reset')
  };

  const updateUserData = async (name, email, phone, group) => {
    console.log(name, email, phone, group);
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const res = await getDocs(q);
      console.log(res);
      res.forEach(async (user) => {
        const getUser = doc(db, "users", user.id);
        await updateDoc(getUser, {
          name: name,
          email: email,
          phone: phone,
          group: group,
        });
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while updating user data");
    }

    return navigate("/")
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserData();
  }, [user, loading]);

  return (
    <div className='edit_container'>
      <div className='edit_form'>
        <div>
          <h3>Full name</h3>
          <input
            type='text'
            className='register_textBox'
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            placeholder='Full Name'
          />
        </div>

        <div>
          <h3>Email</h3>
          <input
            type='text'
            className='register_textBox'
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Full Name'
          />
        </div>

        <div>
          <h3>Phone</h3>
          <input
            type='text'
            className='register_textBox'
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Full Name'
          />
        </div>

        <div onChange={onChangeGroup}>
          <h3>Group</h3>
          <p>
            You can optionally join or create a group to track your progress
            with friends, workmates or family. You can join an existing group
            below, or create a brand new group. Note: You can only select a
            group once, and can't change to another group later on.
          </p>
          <input type='radio' value='none' name='group' /> Don't join a group
          (You can do this later)
          <input type='radio' value='select' name='group' /> I want to join a
          group
          <input type='radio' value='create' name='group' /> I want to create my
          own group
        </div>

        {group === "select" ? <select></select> : ""}
        {group === "create" ? (
          <div>
            {" "}
            <h3> Group name</h3>
            <input
              type='input'
              className='register_textBox'
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder='Create'
            />
          </div>
        ) : (
          ""
        )}

        <div>
            <h3>Update Password</h3>
            <p>If you want to update your password, click on the link below.</p>
            <button
                className='reset_btn'
                onClick={resetPassowrd}
            >Email link</button>
        </div>

        <div className='button-container'>
          <button
            className='update_btn'
            onClick={() => updateUserData(name, email, phone, newGroup)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
