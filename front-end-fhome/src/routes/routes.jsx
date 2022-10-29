import { BrowserRouter, Routes, Route,Navigate, Outlet } from 'react-router-dom';
import Page404 from '../pages/page404'
import Home from '../pages/home'
import Login from '../pages/login'
import Sells from '../pages/sells';
import Clients from '../pages/clients';
import Staff from '../pages/staff';

function PageRoutes(){

  return (
    <BrowserRouter>
      <Routes>
        {/* rutas desprotegidas */}
        <Route path="*" element={<Page404/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>

        {/* rutas protegidas */}
        <Route path="/sells" element={<Sells/>}/>
        <Route path="/clients" element={<Clients/>}/>
        <Route path="/staff" element={<Staff/>}/>
        <Route path="/installations" element={<Clients/>}/>

      </Routes>
    </BrowserRouter>
  );
}


function ProtectedRoute(){
  const isAuthenticated = false
  return isAuthenticated ? <Outlet/> : <Navigate to="/"/>
}

function RedirectRoute(){
  const isAuthenticated = false
  return isAuthenticated ? <Outlet/> : <Navigate to="/home"/>
}

export default PageRoutes
