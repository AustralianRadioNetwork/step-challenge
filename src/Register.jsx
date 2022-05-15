import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, registerWithEmailAndPassword, signInWithGoogle,} from './Firebase';

// Styles
import './Register.scss';

const Register = ()  => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [suburb, setSuburb] = useState('');
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('');
  const [group, setGroup] = useState('');
  const [subscription, setSubscription] = useState('false');
  const [user, loading, error] = useAuthState(auth);

  const onChangeGroup = (event) => {
    setGroup(event.target.value);
  }

  const regions = ['Ballarat', 'Rockhampton', 'Bendigo', 'Riverland']

  const navigate = useNavigate();

  const register = () => {
    if (!name) alert('Please enter name');
    registerWithEmailAndPassword(name, email, password, region, suburb, group, date, subscription);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/dashboard', { replace: true });
  }, [user, loading]);


  return (
    <div className='register'>
      <div className='register_container'>
        <input
          type='text'
          className='register_textBox'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Full Name'
        />
        <input
          type='email'
          className='register_textBox'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='E-mail Address'
        />
        <input
          type='tel'
          className='register_textBox'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder='Phone'
        />
        <input
          type='text'
          className='register_textBox'
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          placeholder='Suburb'
        />

        <input
          type='date'
          className='register_textBox'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder=''
        />

        <select
          type='date'
          className='register_textBox'
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder='Phone'
        >
          <option defaultValue>-not set-</option>
        {regions.map( item => {
            return (
              <option value={item}>{item}</option>
            )
        })}
        </select>

        <div onChange={onChangeGroup}>
          <p>Group</p>
          <input type="radio" value="none" name="gender" /> None
          <input type="radio" value="select" name="gender" /> Select
          <input type="radio" value="create" name="gender" /> Create
        </div>
        
        {group === 'select' ? <div>hey</div> : '' }
        {group === 'create' ?  <div> <input
          type='input'
          className='register_textBox'
          value= {group}
          onChange= {(e) => setGroup(e.target.value)}
          placeholder='Create'
        /></div> : '' } 
        <input
          type='password'
          className='register_textBox'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
        />
        <input
          type='checkbox'
          id='subscription'
          value= 'true'
          onChange={(e) => setSubscription(e.target.value)}
          placeholder='Password'
        />
        <label for="subscription">Subscribe to email?</label>
        <button className='register_btn' onClick={register}>
          Register
        </button>
        <button
          className='register_btn register_google'
          onClick={signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to='/'>Login</Link> now.
        </div>
      </div>
    </div>
  );
}


export default Register;