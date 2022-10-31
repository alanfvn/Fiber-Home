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
      <main>
        {/* titulo de fiberhome */}
        <Container className="mt-5">
          <div className="d-flex align-items-center justify-content-around">
            <div className="text-center w-50">
              <h1>FiberHome</h1>
              <h4>La mejor cobertura de Guatemala</h4>
            </div>
            <div className="w-50">
              <img src={c1} className='w-100'/>
            </div>
          </div>
        </Container>

        {/* mision y vision */}
        <div className="home-mission">
          <Container className='p-4'>
            <h3 className="text-light text-wrap">Nuestra misión</h3>
            <p className="text-light text-wrap">
              FiberHome es una empresa de telecomunicaciones, su enfoque está dirigido 
              al cliente y a la rentabilidad a través de un servicio personalizado y de calidad, 
              tecnología de punta que hace el servicio y/o productos sea el número uno en su tipo.  
              Además de tener personal certificado y comprometido, logrando así brindar un servicio 
              con un 99.9% de alta disponibilidad y de esta forma obtener beneficios para el 
              cliente, los accionistas y el personal interno.
            </p>
            <h3 className="text-light">Nuestra visión</h3>
            <p className="text-light">
              Ser la mejor empresa generadora del servicio de internet en varios lugares remotos 
              de Alta Verapaz, con múltiples nodos o puntos de acceso, además de ejecutar las 
              instalaciones y resolver los incidentes en tiempo récord.
            </p>
          </Container>
        </div>

        <Container className='d-flex justify-content-between mt-5 mb-5' >
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

      </main>
      <CustomFooter/>
    </div>
  ) 
}

export default Home
