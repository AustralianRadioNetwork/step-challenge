import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import './Dashboard.scss';

import { auth, db, logout } from './Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { getDatabase, ref, child, push, update } from "firebase/database";

const Dashboard = () => {

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [steps, setStep] = useState('');
  

  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setStep(data.totalSteps)
      console.log(data)
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
    fetchUserName();
  }, [user, loading]);

  const updateSteps = () => {
   navigate('/update')
  };

  return (
    <div className='dashboard'>
       <div className='dashboard_container'>
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <div>{steps}</div>
         <button className='dashboard_btn update_btn' onClick={updateSteps}>
          Update
         </button>
         <button className='dashboard_btn' onClick={logout}>
          Logout
         </button>
       </div>
    </div>
  );
}
export default Dashboard;