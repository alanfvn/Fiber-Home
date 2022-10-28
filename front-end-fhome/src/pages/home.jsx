import CustomFooter from "./components/footer"
import CustomNavbar from "./components/navbar"
import {Container, Card} from 'react-bootstrap'

import c1 from '../img/cservice1.png'
import card1 from '../img/card1.png'
import card2 from '../img/card2.png'
import card3 from '../img/card3.png'

function Home(){
  return (
    <div className="layout">
      <CustomNavbar/>
      <main className="d-flex flex-column">

        {/* titulo de fiberhome */}
        <div className="home-info">
          <Container className="mt-5">
            <div className="d-flex align-items-center justify-content-around">
              <div className="">
                <h1>FiberHome</h1>
                <h4>La mejor cobertura de Guatemala</h4>
              </div>
              <div className="customer-support">
                <img src={c1} alt="Responsive image"/>
              </div>
            </div>
          </Container>
        </div>

        {/* mision y vision */}
        <div className="home-mission">
          <Container className="mt-5 mb-5">
            <div className="mission mb-5">
              <h2 className="text-light">Nuestra misión</h2>
              <p className="text-light">
                FiberHome es una empresa de telecomunicaciones, su enfoque está dirigido 
                al cliente y a la rentabilidad a través de un servicio personalizado y de calidad, 
                tecnología de punta que hace el servicio y/o productos sea el número uno en su tipo.  
                Además de tener personal certificado y comprometido, logrando así brindar un servicio 
                con un 99.9% de alta disponibilidad y de esta forma obtener beneficios para el 
                cliente, los accionistas y el personal interno.
              </p>
            </div>
            <div className="mb-5">
              <h2 className="text-light">Nuestra visión</h2>
              <p className="text-light">
                Ser la mejor empresa generadora del servicio de internet en varios lugares remotos de Alta 
                Verapaz, con múltiples nodos o puntos de acceso, además de ejecutar las instalaciones y resolver 
                los incidentes en tiempo récord.
              </p>
            </div>
          </Container>
        </div>

          
        <div className='home-locations mt-5 mb-5'>
          <Container className='d-flex justify-content-between' >

            <Card style={{width: "30%"}}>
              <Card.Img variant="top" src={card1} />
              <Card.Body>
                <Card.Title>Velocidad maxima</Card.Title>
                <Card.Text>
                  Ofrecemos servicio de fibra óptica en 
                  todos los departamentos del territorio 
                  Guatemalteco.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card style={{width: "30%"}}>
              <Card.Img variant="top" src={card2} />
              <Card.Body>
                <Card.Title>Soporte 24/7</Card.Title>
                <Card.Text>
                  Nuestro personal de soporte tecnicó está 
                  a tu disposición las 24 horas del dia los 7 
                  dias de la semana.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card style={{width: "30%"}}>
              <Card.Img variant="top" src={card3} />
              <Card.Body>
                <Card.Title>Precios competitivos</Card.Title>
                <Card.Text>
                  Contamos con precios que estan siempre al 
                  alcance de tu bolsillo
                </Card.Text>
              </Card.Body>
            </Card>
          </Container>


        </div>
      </main>
      <CustomFooter/>
    </div>
  ) 
}

export default Home
