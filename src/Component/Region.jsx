import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import { auth, db, logout } from '../Firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';

import './Region.scss'

const Region = () => {

    const region = useParams();

    const [regionData, setRegionData] = useState([])

    const fetchRegionalData = async () => {

        let res = [];

        try {
          const q = query(collection(db, 'users'), where( 'region', '==' , region.region));
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

        setRegionData(res)
    };

    useEffect(() => {
        fetchRegionalData();
      }, []);

    return(
        <div className="region_container">
            <h3>{region.region} Leaderboard</h3>
            <ul className="list_container">
                {regionData.map(item => {
                    return (
                        <li  className="list_item" key={regionData.indexOf(item)}>
                            <h4>{item.name}</h4>
                            <p>{item.steps}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Region;