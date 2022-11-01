import {createRoot} from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/custom.css'
import PageRoutes from './routes/routes'

const root = createRoot(document.getElementById('root'))
root.render(<PageRoutes/>)
