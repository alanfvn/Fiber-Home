import {Navbar, Nav, Container} from 'react-bootstrap'

function CustomNavbar(){
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">FiberHome</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/login">Iniciar sesión</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
     </> 
  );
}

export default CustomNavbar
