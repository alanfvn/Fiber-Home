import { BrowserRouter, Routes, Route,Navigate, Outlet } from 'react-router-dom';
import Page404 from '../pages/page404'
import Home from '../pages/home'
import Login from '../pages/login'
import Sells from '../pages/sells';
import Clients from '../pages/clients';
import Staff from '../pages/staff';
import Installations from '../pages/install';
import { is_user_auth } from '../util/cookie-man';

function PageRoutes(){

  return (
    <BrowserRouter>
      <Routes>
        {/* rutas desprotegidas */}
        <Route path="*" element={<Page404/>}/>
        <Route path="/" element={<Home/>}/>

        {/* rutas de redireccionamiento */}
        <Route element={<RRoute/>}>
          <Route path="/login" element={<Login/>}/>
        </Route>

        {/* routas protegidas */}
        <Route element={<PRoute/>}>
          <Route path="/sells" element={<Sells/>}/>
          <Route path="/clients" element={<Clients/>}/>
          <Route path="/staff" element={<Staff/>}/>
          <Route path="/installations" element={<Installations/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

function PRoute(){
  const isAuthenticated = is_user_auth() 
  return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
}

function RRoute(){
  const isAuthenticated = is_user_auth() 
  return isAuthenticated ? <Navigate to="/"/> : <Outlet/> 
}

export default PageRoutes
