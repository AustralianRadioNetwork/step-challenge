import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import { auth, db, logout } from '../Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

import './Group.scss'

const Group = () => {

    const group = useParams();

    const [groupData, setGroupData] = useState([])
    const [groupTotal, setGroupTotoal] = useState(null);
    const [overallTotal, setOverallTotal] = useState(null);

    const fetchGroupData = async () => {

        let res = [];
        let total = 0;

        try {
          const q = query(collection(db, 'users'), where( 'group', '==' , group.group));
          const doc = await getDocs(q);
          const data = doc.docs;

          data.forEach( user => {
            let result = user.data();
            res.push({name: result.name, steps: result.totalSteps})
            total += result.totalSteps
          })
        } catch (err) {
          console.error(err);
          alert('An error occured while fetching user data');
        }  

        setGroupData(res)
        setGroupTotoal(total)
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
        fetchGroupData();
        fetchOverallTotal();
    }, []);

    return(
        <div className="group_container">
             <div className='content'>
        <div className='card_container'>
        <div className='card'>
        <div className='card_blue'>
            <div className='content'>
            <h2 className='title'>{group.group} total Steps</h2>
            <h1>{groupTotal}</h1>
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

    

        <div className='group_leaderboard'>
          <div className='content'>
            <h4>{group.group} Group Leaderboard</h4>
            <ul className='list_container'>
              {groupData.map((item) => {
                return (
                  <li className='list_item' key={groupData.indexOf(item)}>
                    <h4>{groupData.indexOf(item) + 1}. {item.name}</h4>
                    <span class="separator"></span>
                    <p>{item.steps}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
        </div>
    )
}

export default Group;