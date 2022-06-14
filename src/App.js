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
import Home from './Component/Homepage';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/reset' element={<Reset />} />
          <Route path='/edit-profile' element={<Edit />}/>
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/update' element={<UpdateSteps />} />
          <Route exact path='/regions' element={<Region/>} />
          <Route exact path='/groups' element={<Group/>} />
        </Routes>
      </Router>
      {/* <Home /> */}
    </div>
  );
}
export default App;