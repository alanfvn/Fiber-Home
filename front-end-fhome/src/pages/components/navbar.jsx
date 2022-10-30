import { Navbar, Nav, Container } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';

function CustomNavbar(){
  const location = useLocation();
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">    
        <Container>
          <Navbar.Brand href="/">FiberHome</Navbar.Brand>
          <Navbar.Toggle className="coloring"/>
          <Navbar.Collapse className='justify-content-end'>
            <Nav activeKey={location.pathname}>
              <Nav.Link href="/login">Iniciar sesión</Nav.Link>
              <Nav.Link href="/clients">Clientes</Nav.Link>
              <Nav.Link href="/staff">Personal</Nav.Link>
              <Nav.Link href="/sells">Ventas</Nav.Link>
              <Nav.Link href="/installations">Instalaciones</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
     </> 
  );
}

export default CustomNavbar
