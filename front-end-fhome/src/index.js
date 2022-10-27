import {createRoot} from 'react-dom/client'
import './css/custom.css'
import PageRoutes from './routes/routes'

const root = createRoot(document.getElementById('root'))
root.render(<PageRoutes/>)
