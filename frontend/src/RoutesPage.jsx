import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Logout from './pages/Logout/Logout';
import Register from './pages/Register/Register';

const RoutesPage = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>


         {/* private */}
         <Route element={<AuthOutlet fallbackPath='/login' />}>
                    <Route path='/' element={<Home/>} />
                    

                    {/* <Route path='/profile/:userId' element={<Profile />} /> */}
                    <Route path='/logout' element={<Logout />} />
                </Route>

                {/* error page */}
                <Route path='*' element={<ErrorPage />}/>

      </Routes>
    </Router>
  );
};

export default RoutesPage;