import React from 'react';

import './Tabs.scss'


const Tab = ({activeTab, label, onClickCurrentTab }) => {

    const onClickLabel = () => {
        onClickCurrentTab(label);
    }

    let className = 'tab-list-item';

    if (activeTab === label) {
      className += ' tab-list-active';
    }

    return (
        <li 
            key={label}
            className={className}
            onClick={onClickLabel}
        >
        <h4>{label}</h4>
      </li>
    )

}
export default Tab;