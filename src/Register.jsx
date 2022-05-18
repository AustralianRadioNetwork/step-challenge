import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
  db,
} from "./Firebase";

import { query, collection, getDocs, where } from "firebase/firestore";

// Styles
import "./Register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [date, setDate] = useState("");
  const [region, setRegion] = useState("");
  const [group, setGroup] = useState("");
  const [subscription, setSubscription] = useState("false");
  const [user, loading, error] = useAuthState(auth);
  const [groupOption, setGroupOption] = useState("");
  const [groupArray, setGroupArray] = useState([]);

  const onChangeGroup = (event) => {
    setGroupOption(event.target.value);
  };

  const regions = ["Ballarat", "Rockhampton", "Bendigo", "Riverland"];

  const navigate = useNavigate();

  const register = () => {
    if (!firstName) alert("Please enter name");
    let fullName = firstName + " " + lastName;
    setFullName(fullName);
    registerWithEmailAndPassword(
      firstName,
      lastName,
      fullName,
      email,
      phone,
      password,
      region,
      suburb,
      group,
      date,
      subscription
    );
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

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard", { replace: true });
    fetchGroupData();
  }, [user, loading]);

  return (
    <div className='register'>
      <div className='register_container'>
        <div className='info'>
          <p>
            Fill out the form below to join this year’s Feb Fit Step Challenge!
          </p>
        </div>
        <div className='form'>
          <div className='form-field'>
            <h3>First name</h3>
            <input
              type='text'
              className='register_textBox'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Last name</h3>
            <input
              type='text'
              className='register_textBox'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Email</h3>
            <input
              type='email'
              className='register_textBox'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Phone</h3>
            <input
              type='tel'
              className='register_textBox'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Suburb</h3>
            <input
              type='text'
              className='register_textBox'
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              placeholder='Suburb'
            />
          </div>

          <div className='form-field'>
            <h3>Date of Birth</h3>
            <input
              type='date'
              className='register_textBox'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field'>
            <h3>Region</h3>
            <p>
              Choose your closest region. If it isn’t available, please select
              the ‘Other’ option.
            </p>
            <select
              type='date'
              className='register_textBox'
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder=''
            >
              <option defaultValue>-not set-</option>
              {regions.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
          </div>

          <div className='form-field group'>
            <h3>Group</h3>
            <p>
              You can optionally join or create a group to track your progress
              with friends, workmates or family. You can join an existing group
              below, or create a brand new group. Note: You can only select a
              group once, and can’t change to another group later on.
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
                className='register_textBox'
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
                  className='register_textBox'
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder=''
                />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className='form-field'>
            <h3>Choose Your Password</h3>
            <p>Choose a password you’ll use to login to the site.</p>
            <input
              type='password'
              className='register_textBox'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='form-field subscription'>
            <input
              type='checkbox'
              id='subscription'
              value='true'
              onChange={(e) => setSubscription(e.target.value)}
              placeholder='Password'
            />
            <label for='subscription'>
              Yes, I agree to receive information and offers from Grant
              Broadcasters and Feb Fit sponsors via email.
            </label>
          </div>
        </div>
      </div>
      <button className='register_btn' onClick={register}>
        Register
      </button>
      {/* <button
        className='register_btn register_google'
        onClick={signInWithGoogle}
      >
        Register with Google
      </button> */}
    </div>
  );
};

export default Register;
