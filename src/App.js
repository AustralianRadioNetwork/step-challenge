import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Login from './Login';
import Register from './Register';
import Reset from './Reset';
import Dashboard from './Dashboard';
import UpdateSteps from './UpdateSteps';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/reset' element={<Reset />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/update' element={<UpdateSteps />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;