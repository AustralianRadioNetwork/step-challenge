import React, { useState } from "react";

// Styles
import "./Accordion.scss";

const Accordion = ({ date, steps, sendData, itemState}) => {

  // sets limit to user input 
  const min = 0;
  const max = 50000;

  console.log(itemState)
    
  const [isActive, setIsActive] = useState(itemState);

  const [newSteps, setNewSteps] = useState(steps);

  const handleChange = (e) => {

    const newValue = Math.max(min, Math.min(max, Number(e.target.value)));

    setNewSteps(newValue)
    sendData({date:date, steps: parseInt(newValue)});
  }
 
  return (
    <div className='accordion-item' id={new Date(date).getDate()}>
      <div className='accordion-title' onClick={() => setIsActive(!isActive)}>
        <h5 className='heading'>
          {new Date(date).toLocaleString("en-au", { month: "long" }) +
            "," +
            ("0" + new Date(date).getDate()).slice(-2)}
        </h5>
      </div>
      {isActive && (
        <div className='accordion-content'>
          <input
            type='number'
            className='update_textBox'
            value={newSteps}
            onChange={handleChange}
            name={date}
            placeholder={steps}
          />
        </div>
      )}
    </div>
  );
};

export default Accordion;
