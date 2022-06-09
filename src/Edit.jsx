import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

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
  // const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupOption, setGroupOption] = useState("");
  const [groupArray, setGroupArray] = useState([]);
  const [group, setGroup] = useState("");
  const [newGroup, setNewGroup] = useState("");

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setFullName(data.fullName);
      setEmail(data.email);
      setPhone(data.phone);
      setCurrentGroup(data.group);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  // fetch groups in database
  const fetchGroupData = async () => {
    let groupArray = [];

    try {
      const q = query(collection(db, "users"));
      const doc = await getDocs(q);
      const data = doc.docs;

      data.forEach((user) => {
        let result = user.data();

        if (result.group !== "none") {
          console.log(result.group);
          groupArray.push(result.group);
        }
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }

    setGroupArray(groupArray);
  };

  const onChangeGroup = (event) => {
    setGroupOption(event.target.value);
  };

  const resetPassowrd = () => {
    window.location.href = "/reset-password";
  };

  const updateUserData = async (firstName, lastName, email, phone, group) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const res = await getDocs(q);
      console.log(res);
      res.forEach(async (user) => {
        const getUser = doc(db, "users", user.id);
        await updateDoc(getUser, {
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + "" + lastName,
          email: email,
          phone: phone,
          group: group,
        });
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while updating user data");
    }

    return window.location.href = "/";
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return window.location.href = "/";
    fetchUserData();
    fetchGroupData();
  }, [user, loading]);

  return (
    <div className='edit'>
      <div className='edit_container'>
        <div className='form'>
          <div className='form-field'>
            <h3>First name</h3>
            <input
              type='text'
              className='edit_textBox'
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Last name</h3>
            <input
              type='text'
              className='edit_textBox'
              value={lastName || ""}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Email</h3>
            <input
              type='text'
              className='edit_textBox'
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Phone</h3>
            <input
              type='text'
              className='edit_textBox'
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=''
            />
          </div>

          {currentGroup !== null ? (
            <div className='form-field' onChange={onChangeGroup}>
              <h3>Group</h3>
              <p>
                You can optionally join or create a group to track your progress
                with friends, workmates or family. You can join an existing
                group below, or create a brand new group. Note: You can only
                select a group once, and can't change to another group later on.
              </p>
            </div>
          ) : (
            <div className='form-field group'>
              <h3>Group</h3>
              <p>
                You can optionally join or create a group to track your progress
                with friends, workmates or family. You can join an existing
                group below, or create a brand new group. Note: You can only
                select a group once, and can’t change to another group later on.
              </p>
              <div className='radio-buttons' onChange={onChangeGroup}>
                <div>
                  <input type='radio' value='null' name='group' />{" "}
                  <label for='name'>
                    Don’t join a group (You can do this later)
                  </label>
                </div>
                <div>
                  <input type='radio' value='select' name='group' />{" "}
                  <label for='select'>I want to join a group</label>
                </div>
                <div>
                  <input type='radio' value='create' name='group' />{" "}
                  <label for='create'>I want to create my own group</label>
                </div>
              </div>
              {groupOption === null ? setGroup("none") : ""}
              {groupOption === "select" ? (
                <select
                  type='text'
                  className='edit_textBox'
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder=''
                >
                  <option defaultValue>-not set-</option>
                  {groupArray.map((item) => {
                    return <option value={item}>{item}</option>;
                  })}
                </select>
              ) : (
                ""
              )}
              {groupOption === "create" ? (
                <div>
                  <h3>Group name</h3>
                  <input
                    type='input'
                    className='edit_textBox'
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder=''
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}

          <div className='form-field'>
            <h3>Update Password</h3>
            <p>If you want to update your password, click on the link below.</p>
            <p className='reset_btn' onClick={resetPassowrd}>
              Email link
            </p>
          </div>
        </div>
      </div>
      <button
        className='update_btn'
        onClick={() =>
          updateUserData(firstName, lastName, email, phone, newGroup)
        }
      >
        Submit
      </button>
    </div>
  );
};

export default Edit;
