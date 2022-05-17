import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import { auth, db, logout } from '../Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

import './Region.scss'

const Group = () => {

    const group = useParams();

    const [groupData, setGroupData] = useState([])

    const fetchGroupData = async () => {

        let res = [];

        try {
          const q = query(collection(db, 'users'), where( 'group', '==' , group.group));
          const doc = await getDocs(q);
          const data = doc.docs;

          data.forEach( user => {
            let result = user.data();
            res.push({name: result.name, steps: result.totalSteps})
          })
        } catch (err) {
          console.error(err);
          alert('An error occured while fetching user data');
        }  

        setGroupData(res)
    };

    useEffect(() => {
        fetchGroupData();
      }, []);

    return(
        <div className="group_container">
            <h3>{group.group} Leaderboard</h3>
            <ul className="list_container">
                {groupData.map(item => {
                    return (
                        <li  className="list_item" key={groupData.indexOf(item)}>
                            <h4>{item.name}</h4>
                            <p>{item.steps}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Group;