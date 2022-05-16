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
  const [region, setRegion] = useState('');
  const [group , setGroup] = useState('');
  

  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setStep(data.totalSteps)
      setRegion(data.region)
      setGroup(data.group)
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

  const regionData = (region) => {
    navigate(`/region/${region}`)
  }

  return (
    <div className='dashboard'>
       <div className='dashboard_container'>
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <div> Your Region: <p onClick={() => regionData(region)}>{region}</p></div>
         <div>Your Group: <p href='/'>{group}</p></div>
         <button className='dashboard_btn' onClick={logout}>
          Logout
         </button>
       </div>
       
       <div className='current_status_card'>
          <div className='title'>
            <h2>Your Steps</h2>
          </div>
          <div className='stats'>
              <h4>Current Steps: {steps}</h4>
              <button className='dashboard_btn update_btn' onClick={updateSteps}>
          Update
         </button>
          </div>
       </div>
    </div>
  );
}
export default Dashboard;