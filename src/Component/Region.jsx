import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { auth, db, logout } from '../Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { numberWithCommas } from '../numberFormatter';

import Pagination from './Pagination';
import Tabs from './Tabs';

import './Region.scss';


const Region = () => {
  
  const path = window.location.search;

  const region = path.replace('?s=', '');

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

  const handleToggle = (event) => {

    if(document.getElementById('toggle-item').style.display === 'none') {
      document.getElementById('toggle-item').style.display = 'block';
    } else {
      document.getElementById('toggle-item').style.display = 'none';
    }

  }

  useEffect(() => {
    fetchRegionalUserData();
    fetchOverallTotal();
  }, []);

  let x = [{label: 'nsw' , data: [{
    name: 'Pranab', steps: 23244
  },{
    name: 'Pranab', steps: 23244
  },{
    name: 'Pranab', steps: 23244
  }]},{label: 'place' ,  data: [{
    name: 'Pranab', steps: 23244
  }]}]

  if (region){
    return (
      <div className='region_container'>
        <div className='content'>
          <div className='card_container'>
          <div className='card'>
          <div className='card_blue'>
              <div className='content'>
              <h2 className='title'>{region} Total Steps</h2>
              <h1>{numberWithCommas(regionalTotal)}</h1>
              </div>
            </div>
          </div>
           <div className='card'>
           <div className='card_grey'>
               <div className='content'>
               <h2 className='title'>Overall Total Steps</h2>
              <h1>{numberWithCommas(overallTotal)}</h1>
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
                      <p>{numberWithCommas(item.steps)}</p>
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
    return (
      <div className='tab-container'>
        <div className='tab-info'>
          <h1 className='title'>Total Steps by Regions</h1>
          <p>Check back starting February 1 to view each region’s step count.</p>
        </div>
        <Tabs tabs={x} />
        <div className='toggle-div'>
          <h5 onClick={handleToggle} className='toggle'>Why isn't my region shown?</h5>
          <p className='toggle-item' id='toggle-item'>The Feb Fit Step Challenge was created for selected regions around Australia, but anyone can take part! If your region isn’t available when joining, just choose the option ‘other’.</p>
        </div>
    </div>
    )
  }
 
};

export default Region;
