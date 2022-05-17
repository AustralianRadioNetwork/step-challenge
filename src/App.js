import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Login from './Login';
import Register from './Register';
import Reset from './Reset';
import Dashboard from './Dashboard';
import UpdateSteps from './UpdateSteps';
import Region from './Component/Region'
import Group from './Component/Group';
import Edit from './Edit';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/reset' element={<Reset />} />
          <Route path='dashboard/edit-profile' element={<Edit />}/>
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/update' element={<UpdateSteps />} />
          <Route exact path='/region/:region' element={<Region/>} />
          <Route exact path='/group/:group' element={<Group/>} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;