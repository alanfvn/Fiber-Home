import { Navbar, Nav, Container } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import { clean_cookies, is_user_auth } from '../../util/cookie-man';

function CustomNavbar(){
  const location = useLocation();
  const auth = is_user_auth() 
  const nav = useNavigate()

  const logout = () =>{
    clean_cookies()
    nav('/')
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">    
        <Container>
          <Navbar.Brand href="/">FiberHome</Navbar.Brand>
          <Navbar.Toggle className="coloring"/>
          <Navbar.Collapse className='justify-content-end'>
            <Nav activeKey={location.pathname}>
              {
                auth ?
                <>
                  <Nav.Link href="/staff"><i className='fa-solid fa-clipboard-user'/> Personal</Nav.Link>
                  <Nav.Link href="/clients"><i className='fa-solid fa-users'/> Clientes</Nav.Link>
                  <Nav.Link href="/sells"><i className='fa-solid fa-dollar'/> Ventas</Nav.Link>
                  <Nav.Link href="/installations"><i className="fa-solid fa-screwdriver-wrench"/> Instalaciones</Nav.Link>
                  <Nav.Link href="#" onClick={logout}><i className="fa-solid fa-right-from-bracket"/> Cerrar sesión</Nav.Link>
                </>
                :
                <Nav.Link href="/login">Iniciar sesión</Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
     </> 
  );
}

export default CustomNavbar
