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
                  <Nav.Link href="/clients">Clientes</Nav.Link>
                  <Nav.Link href="/staff">Personal</Nav.Link>
                  <Nav.Link href="/sells">Ventas</Nav.Link>
                  <Nav.Link href="/installations">Instalaciones</Nav.Link>
                  <Nav.Link href="#" onClick={logout}>Cerrar sesión</Nav.Link>
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
