import React, { useState, useEffect} from 'react';

import { auth, db, logout } from '../Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

import { numberWithCommas } from '../numberFormatter';


import './Homepage.scss';


const Home = () => {

  const [overallTotal, setOverallTotal] = useState(null);

  const fetchOverallTotal = async () => {
    let total = 0;

    try {
      const q = query(collection(db, 'users'));
      const doc = await getDocs(q);
      const data = doc.docs;

      data.forEach((user) => {
        let result = user.data();
        total += result.totalSteps;
      });
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
    setOverallTotal(total);
  };


  useEffect(() => {
    fetchOverallTotal();
  }, [overallTotal]);

  
  return (
    <div className='home-widget'>
      <h2>
        <a href='/regions'>{numberWithCommas(overallTotal)} steps tracked</a>
      </h2>
    </div>
  );
};

export default Home;
