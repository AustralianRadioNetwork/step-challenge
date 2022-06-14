import React, {useState, useEffect} from 'react';

import Tab from './Tab.jsx';

import './Tabs.scss';

const Tabs = (tabs) => {

    let tabData = tabs.tabs

    console.log(tabs)

    const [activeTab, setActiveTab] = useState(tabData[0].label);

    console.log(activeTab)

    const onClickTabItem  = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className="tabs">
          <div className="tab-list">
            {tabData.map((item) => {
                return (
                    <Tab
                        activeTab={activeTab}
                        key={item.label}
                        label={item.label}
                        onClickCurrentTab={onClickTabItem}
                    ></Tab>
                )
            })}
          </div>
          <div className="tab-content">
            {tabData.map((item) => {
                console.log(item)
              if (item.label !== activeTab) return undefined;
              return (
                <ul className='list_container'>
                {item.data.map((x) => {
                  return (
                    <li className='list_item' key={item.data.indexOf(x)}>
                      <h4>{x.name}</h4>
                      <span className="separator"></span>
                      <p>{x.steps}</p>
                    </li>
                  );
                })}
              </ul>
              )
            })}
          </div>
        </div>
      );
}

export default Tabs;