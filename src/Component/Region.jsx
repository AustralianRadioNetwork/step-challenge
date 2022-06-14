import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { auth, db, logout } from '../Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

import Pagination from './Pagination';

import './Region.scss';


const Region = () => {
  
  const path = window.location.search;

  const region = path.replace('?s=', '');

  console.log(path)

  const [regionData, setRegionData] = useState([]);
  const [regionalTotal, setRegionalTotal] = useState(null);
  const [overallTotal, setOverallTotal] = useState(null);
  const [regionalGroupData, setRegionalGroupData] = useState([]);


  const fetchRegionalUserData = async () => {
    let res = [];
    let groupData = [];
    let total = 0;

    try {
      const q = query(
        collection(db, 'users'),
        where('region', '==', region)
      );
      const doc = await getDocs(q);
      const data = doc.docs;

      data.forEach((user) => {
        let result = user.data();
        res.push({ name: result.fullName, steps: result.totalSteps });
        groupData.push({ name: result.group, steps: result.totalSteps });
        total += result.totalSteps;
      });
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }

    setRegionalTotal(total);
    setRegionData(res);
    setRegionalGroupData(groupData);
  };

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
    fetchRegionalUserData();
    fetchOverallTotal();
  }, []);

  if (region){
    return (
      <div className='region_container'>
        <div className='content'>
          <div className='card_container'>
          <div className='card'>
          <div className='card_blue'>
              <div className='content'>
              <h2 className='title'>{region} Total Steps</h2>
              <h1>{regionalTotal}</h1>
              </div>
            </div>
          </div>
           <div className='card'>
           <div className='card_grey'>
               <div className='content'>
               <h2 className='title'>Overall Total Steps</h2>
              <h1>{overallTotal}</h1>
               </div>
              
            </div>
           </div>
           
          </div>
  
          <div className='region_leaderboard'>
            <div className='content'>
              <h4>{region.region} Leaderboard</h4>         
              <Pagination itemsPerPage={15} paginationData={regionData} />
            </div>
          </div>
  
          <div className='group_leaderboard'>
            <div className='content'>
              <h4>{region} Group Leaderboard</h4>
              <ul className='list_container'>
                {regionalGroupData.map((item) => {
                  return (
                    <li className='list_item' key={regionalGroupData.indexOf(item)}>
                      <h4>{regionalGroupData.indexOf(item) + 1}. {item.name}</h4>
                      <span className="separator"></span>
                      <p>{item.steps}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return 'todo';
  }
 
};

export default Region;
