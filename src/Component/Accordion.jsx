import React, { useState } from "react";

// Styles
import "./Accordion.scss";

const Accordion = ({ date, steps, sendData}) => {
    
  const [isActive, setIsActive] = useState(false);

  const [newSteps, setNewSteps] = useState(steps);

  const handleChange = (e) => {
      setNewSteps(e.target.value)
      sendData({date:date, steps: parseInt(e.target.value)});
  }

  return (
    <div className='accordion-item'>
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
            max='50000'
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
