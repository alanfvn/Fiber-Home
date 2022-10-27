import { BrowserRouter, Routes, Route,Navigate, Outlet } from 'react-router-dom';
import Page404 from '../pages/page404'
import Home from '../pages/home'
import Login from '../pages/login'

function PageRoutes(){

  return (
    <BrowserRouter>
      <Routes>
        {/* rutas desprotegidas */}
        <Route path="*" element={<Page404/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
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
