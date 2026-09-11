import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Mystore from './redux/Store/Mystore.js';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <Provider store={Mystore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)
