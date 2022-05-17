import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className='login'>
      <div className='login_container'>
        <p>
          You must be logged in to view this page. Please login using the form
          below, or <a href='/register'>join now.</a>
        </p>
        <div className='login_field'>
          <div className='field'>
            <label>Email Address</label>
            <input
              type='text'
              className='login_textBox'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=''
            />
          </div>

          <div className='field'>
            <label>Password</label>
            <input
              type='password'
              className='login_textBox'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=''
            />
          </div>

          <button
            className='login_btn'
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          {/* <button className='login_btn login_google' onClick={signInWithGoogle}>
            Login with Google
          </button> */}
          <div className="reset_link">
            <Link to='/reset'>Lost your password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
